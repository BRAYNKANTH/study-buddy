import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DollarSign, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';

interface PaymentStatusProps {
  parent: any;
}

export default function PaymentStatus({ parent }: PaymentStatusProps) {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const myPayments = payments.filter((p: any) => p.parentId === parent.id);

  const viewReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const downloadReceipt = (payment: any) => {
    if (payment.receipt) {
      const link = document.createElement('a');
      link.href = payment.receipt;
      link.download = payment.receiptFileName || 'receipt';
      link.click();
      toast.success('Receipt downloaded');
    }
  };

  const pendingCount = myPayments.filter((p: any) => p.status === 'Pending Approval').length;
  const approvedCount = myPayments.filter((p: any) => p.status === 'Approved').length;
  const rejectedCount = myPayments.filter((p: any) => p.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl">{pendingCount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl">{approvedCount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl">{rejectedCount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {myPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myPayments
                .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                .map((payment: any) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4>{payment.studentName}</h4>
                        <p className="text-sm text-gray-600">
                          Reference: {payment.reference}
                        </p>
                      </div>
                      <Badge
                        variant={
                          payment.status === 'Approved'
                            ? 'default'
                            : payment.status === 'Rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Submitted Date</p>
                        <p>{new Date(payment.submittedDate).toLocaleDateString()}</p>
                      </div>
                      {payment.approvedDate && (
                        <div>
                          <p className="text-gray-600">
                            {payment.status === 'Approved' ? 'Approved' : 'Rejected'} Date
                          </p>
                          <p>{new Date(payment.approvedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewReceipt(payment)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Receipt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(payment)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    {payment.status === 'Pending Approval' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-yellow-800">
                          Your payment is under review. You will be notified once it's processed.
                        </p>
                      </div>
                    )}

                    {payment.status === 'Rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-red-800">
                          Payment was rejected. Please contact admin or submit a new payment.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Preview Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              {selectedPayment?.studentName} - {selectedPayment?.receiptFileName}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedPayment?.receipt && (
              selectedPayment.receiptFileName.toLowerCase().endsWith('.pdf') ? (
                <embed
                  src={selectedPayment.receipt}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              ) : (
                <img
                  src={selectedPayment.receipt}
                  alt="Payment Receipt"
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
