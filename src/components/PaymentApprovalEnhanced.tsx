import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { CheckCircle, XCircle, Eye, Download, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function PaymentApprovalEnhanced() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const students = JSON.parse(localStorage.getItem('students') || '[]');

  const approvePayment = (paymentId: string) => {
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const paymentIndex = allPayments.findIndex((p: any) => p.id === paymentId);
    
    if (paymentIndex !== -1) {
      allPayments[paymentIndex].status = 'Approved';
      allPayments[paymentIndex].approvedDate = new Date().toISOString();
      localStorage.setItem('payments', JSON.stringify(allPayments));
      
      // Create notification for parent
      const payment = allPayments[paymentIndex];
      const notification = {
        id: `N${Date.now()}`,
        type: 'payment',
        title: 'Payment Approved',
        message: `Payment for ${payment.studentName} - ${payment.month} has been approved`,
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'parent',
        targetId: payment.parentId
      };
      
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      toast.success('Payment approved successfully');
      window.location.reload();
    }
  };

  const rejectPayment = (paymentId: string) => {
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const paymentIndex = allPayments.findIndex((p: any) => p.id === paymentId);
    
    if (paymentIndex !== -1) {
      allPayments[paymentIndex].status = 'Rejected';
      allPayments[paymentIndex].rejectedDate = new Date().toISOString();
      localStorage.setItem('payments', JSON.stringify(allPayments));
      
      // Create notification for parent
      const payment = allPayments[paymentIndex];
      const notification = {
        id: `N${Date.now()}`,
        type: 'payment',
        title: 'Payment Rejected',
        message: `Payment for ${payment.studentName} - ${payment.month} has been rejected. Please resubmit.`,
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'parent',
        targetId: payment.parentId
      };
      
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      toast.success('Payment rejected');
      window.location.reload();
    }
  };

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

  // Enhanced payment data with student details
  const enhancedPayments = payments.map((payment: any) => {
    const student = students.find((s: any) => s.id === payment.studentId);
    return {
      ...payment,
      grade: student?.grade || 'N/A',
      subjects: student?.subjects || []
    };
  });

  // Apply filters
  const filteredPayments = enhancedPayments.filter((payment: any) => {
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;
    const gradeMatch = filterGrade === 'all' || payment.grade.toString() === filterGrade;
    const searchMatch = 
      payment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.month?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && gradeMatch && searchMatch;
  });

  // Statistics
  const pendingCount = payments.filter((p: any) => p.status === 'Pending Approval').length;
  const approvedCount = payments.filter((p: any) => p.status === 'Approved').length;
  const rejectedCount = payments.filter((p: any) => p.status === 'Rejected').length;
  const totalAmount = payments
    .filter((p: any) => p.status === 'Approved')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl">{pendingCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-orange-600" />
              </div>
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
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
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
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Approved</p>
                <p className="text-2xl">Rs. {totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search student, parent, reference, month..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending Approval">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Subject(s)</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments
                    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                    .map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p>{payment.studentName}</p>
                            <p className="text-xs text-gray-500">{payment.parentName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Grade {payment.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            {payment.subjects.join(', ') || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{payment.month || 'N/A'}</TableCell>
                        <TableCell>Rs. {payment.amount?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-xs">{payment.reference}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewReceipt(payment)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReceipt(payment)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'Pending Approval' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => approvePayment(payment.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectPayment(payment.id)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              {selectedPayment?.studentName} - {selectedPayment?.month} - Rs. {selectedPayment?.amount}
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
