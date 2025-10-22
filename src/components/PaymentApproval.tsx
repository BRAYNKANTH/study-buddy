import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function PaymentApproval() {
  const [payments, setPayments] = useState<any[]>(
    JSON.parse(localStorage.getItem('payments') || '[]')
  );
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const updatePayment = (paymentId: string, status: string) => {
    const updated = payments.map(p =>
      p.id === paymentId ? { ...p, status, approvedDate: new Date().toISOString() } : p
    );
    setPayments(updated);
    localStorage.setItem('payments', JSON.stringify(updated));

    // Create notification for parent
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      const notification = {
        id: `N${Date.now()}`,
        type: 'payment',
        title: `Payment ${status}`,
        message: `Your payment for ${payment.studentName} has been ${status.toLowerCase()}`,
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'parent',
        targetId: payment.parentId
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    toast.success(`Payment ${status.toLowerCase()} successfully`);
  };

  const viewReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const downloadReceipt = (payment: any) => {
    const link = document.createElement('a');
    link.href = payment.receipt;
    link.download = payment.receiptFileName || 'receipt';
    link.click();
    toast.success('Receipt downloaded');
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'pending') return p.status === 'Pending Approval';
    if (filter === 'approved') return p.status === 'Approved';
    if (filter === 'rejected') return p.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Payment Approvals</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({payments.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({payments.filter(p => p.status === 'Pending Approval').length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved ({payments.filter(p => p.status === 'Approved').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejected ({payments.filter(p => p.status === 'Rejected').length})
          </Button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No payments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg">{payment.studentName}</h3>
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
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Parent Name</p>
                        <p>{payment.parentName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reference Number</p>
                        <p>{payment.reference}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Submitted Date</p>
                        <p>{new Date(payment.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Receipt</p>
                        <p className="text-indigo-600">{payment.receiptFileName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewReceipt(payment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Receipt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReceipt(payment)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {payment.status === 'Pending Approval' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updatePayment(payment.id, 'Approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updatePayment(payment.id, 'Rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
