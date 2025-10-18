import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText } from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'custom'>('daily');
  const [dailyDate, setDailyDate] = useState<Date>(new Date());
  const [monthlyYear, setMonthlyYear] = useState<number>(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState<number>(new Date().getMonth() + 1);
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());

  const handleDownloadReport = async () => {
    let url = '';
    
    if (reportType === 'daily') {
      const dateStr = format(dailyDate, 'yyyy-MM-dd');
      url = `/api/reports/sales/daily?date=${dateStr}`;
    } else if (reportType === 'monthly') {
      url = `/api/reports/sales/monthly?year=${monthlyYear}&month=${monthlyMonth}`;
    } else if (reportType === 'custom') {
      const startStr = format(customStartDate, 'yyyy-MM-dd');
      const endStr = format(customEndDate, 'yyyy-MM-dd');
      url = `/api/reports/sales/custom?startDate=${startStr}&endDate=${endStr}`;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-muted-foreground">Generate and download sales reports</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'daily' && (
              <div>
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dailyDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dailyDate}
                      onSelect={(date) => date && setDailyDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {reportType === 'monthly' && (
              <div className="space-y-2">
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={monthlyYear}
                    onChange={(e) => setMonthlyYear(parseInt(e.target.value))}
                    min="2000"
                    max="2100"
                  />
                </div>
                <div>
                  <Label>Month</Label>
                  <Select value={monthlyMonth.toString()} onValueChange={(value) => setMonthlyMonth(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {format(new Date(2024, month - 1, 1), 'MMMM')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {reportType === 'custom' && (
              <div className="space-y-2">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(customStartDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={(date) => date && setCustomStartDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(customEndDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={(date) => date && setCustomEndDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <Button onClick={handleDownloadReport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Report (PDF)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Daily Report:</strong> Get a detailed report of all sales for a specific day.
            </p>
            <p>
              <strong>Monthly Report:</strong> Get a comprehensive report of all sales for an entire month.
            </p>
            <p>
              <strong>Custom Date Range:</strong> Generate a report for any date range you specify.
            </p>
            <p className="pt-4 border-t">
              All reports are generated as PDF files and include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Total number of sales</li>
              <li>Total revenue</li>
              <li>Individual transaction details</li>
              <li>Customer information</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
