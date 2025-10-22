import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Download, Eye, Upload, X, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
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

interface MonthlyPaymentSystemProps {
  parent: any;
  onBack?: () => void;
}

export default function MonthlyPaymentSystem({ parent, onBack }: MonthlyPaymentSystemProps) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const myStudents = students.filter((s: any) => s.parentId === parent.id);
  
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const myPayments = payments.filter((p: any) => p.parentId === parent.id);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceipt(reader.result as string);
      setReceiptFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptFileName('');
  };

  const submitPayment = () => {
    if (!selectedStudent || !selectedMonth || !amount || !reference || !receipt) {
      toast.error('Please fill all fields and upload receipt');
      return;
    }

    const student = students.find((s: any) => s.id === selectedStudent);
    if (!student) return;

    // Check if payment for this month already exists
    const existingPayment = myPayments.find(
      (p: any) => p.studentId === selectedStudent && p.month === selectedMonth
    );

    if (existingPayment) {
      toast.error(`Payment for ${selectedMonth} already exists for ${student.name}`);
      return;
    }

    const newPayment = {
      id: `PAY${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      parentId: parent.id,
      parentName: parent.name,
      month: selectedMonth,
      amount: parseFloat(amount),
      reference: reference,
      receipt: receipt,
      receiptFileName: receiptFileName,
      status: 'Pending Approval',
      submittedDate: new Date().toISOString()
    };

    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    allPayments.push(newPayment);
    localStorage.setItem('payments', JSON.stringify(allPayments));

    // Create notification for admin
    const notification = {
      id: `N${Date.now()}`,
      type: 'payment',
      title: 'New Payment Submitted',
      message: `${parent.name} submitted payment for ${student.name} - ${selectedMonth}`,
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: 'admin'
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Payment submitted successfully!');
    
    // Reset form
    setSelectedStudent('');
    setSelectedMonth('');
    setAmount('');
    setReference('');
    setReceipt(null);
    setReceiptFileName('');

    // Reload payments
    window.location.reload();
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

  // Calculate statistics
  const pendingCount = myPayments.filter((p: any) => p.status === 'Pending Approval').length;
  const approvedCount = myPayments.filter((p: any) => p.status === 'Approved').length;
  const rejectedCount = myPayments.filter((p: any) => p.status === 'Rejected').length;
  const totalPaid = myPayments
    .filter((p: any) => p.status === 'Approved')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
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
              <CheckCircle className="h-8 w-8 text-green-500" />
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
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl">Rs. {totalPaid.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Select Student *</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {myStudents.map((student: any) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} (Grade {student.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Select Month *</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Amount (Rs.) *</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Payment Reference *</label>
              <Input
                placeholder="Enter reference number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Upload Receipt *</label>
            {!receipt ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="paymentReceipt" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700">
                    Click to upload receipt
                  </span>
                </label>
                <input
                  id="paymentReceipt"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Upload className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">{receiptFileName}</p>
                    <p className="text-xs text-gray-500">Ready to submit</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeReceipt}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={submitPayment}>
            Submit Payment
          </Button>
        </CardContent>
      </Card>

      {/* Payment History */}
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
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPayments
                    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                    .map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.studentName}</TableCell>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>Rs. {payment.amount?.toFixed(2) || '0.00'}</TableCell>
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
                        <TableCell className="text-sm">
                          {new Date(payment.submittedDate).toLocaleDateString()}
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
