<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Return Items Report</title>
    <style>
        body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #0f172a;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 8px 0 0 0;
            color: #64748b;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            border: 1px solid #e2e8f0;
            background-color: #ffffff;
        }
        th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #475569;
            text-transform: capitalize;
            font-size: 11px;
            letter-spacing: 0.025em;
        }
        td {
            font-size: 12px;
            color: #334155;
            vertical-align: middle;
        }
        .item-name {
            font-weight: 500;
            color: #0f172a;
            font-size: 13px;
        }
        .text-muted {
            color: #64748b;
            font-size: 11px;
            margin-top: 2px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 500;
            text-align: center;
            text-transform: capitalize;
            line-height: 1.2;
        }
        .badge-good    { background-color: #dcfce3; color: #166534; }
        .badge-fair    { background-color: #fef9c3; color: #854d0e; }
        .badge-damaged { background-color: #fee2e2; color: #991b1b; }
        .badge-paid    { background-color: #dcfce3; color: #166534; }
        .badge-unpaid  { background-color: #fee2e2; color: #991b1b; }

        .text-center { text-align: center; }
        .text-right  { text-align: right; }
        .truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            text-align: right;
            font-size: 11px;
            color: #94a3b8;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Return Items Report</h1>
        <p>Generated on {{ now()->format('F j, Y, g:i A') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">No</th>
                <th style="width: 22%;">Item Name</th>
                <th style="width: 15%;">Borrower</th>
                <th style="width: 12%;">Received By</th>
                <th style="width: 14%;">Return Date</th>
                <th style="width: 10%;">Condition</th>
                <th style="width: 12%; text-align: right;">Fine Amount</th>
                <th style="width: 10%;">Fine Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($return_items as $index => $return_item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <div class="item-name">{{ $return_item->borrowing->item->name ?? 'N/A' }}</div>
                        <div class="text-muted">{{ $return_item->borrowing->item->category->name ?? 'No Category' }}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500; color: #0f172a;">{{ $return_item->borrowing->borrower->name ?? 'N/A' }}</div>
                        <div class="text-muted">{{ $return_item->borrowing->borrower->email ?? '' }}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500; color: #0f172a;">{{ $return_item->received->name ?? '-' }}</div>
                        @if($return_item->received)
                            <div class="text-muted">Role: {{ ucfirst($return_item->received->role ?? 'N/A') }}</div>
                        @endif
                    </td>
                    <td>
                        <div style="font-weight: 500; color: #334155;">
                            {{ \Carbon\Carbon::parse($return_item->return_date)->format('d M Y') }}
                        </div>
                        <div class="text-muted">
                            Borrowed: {{ \Carbon\Carbon::parse($return_item->borrowing->borrow_date)->format('d M Y') }}
                        </div>
                    </td>
                    <td>
                        @php
                            $conditionClass = match($return_item->condition) {
                                'good'    => 'badge-good',
                                'damaged' => 'badge-damaged',
                                default   => 'badge-fair',
                            };
                        @endphp
                        <span class="badge {{ $conditionClass }}">
                            {{ ucfirst($return_item->condition) }}
                        </span>
                    </td>
                    <td class="text-right">
                        {{ $return_item->fine_amount ? 'Rp ' . number_format($return_item->fine_amount, 0, ',', '.') : '-' }}
                    </td>
                    <td>
                        @if($return_item->fine_amount && $return_item->fine_amount > 0)
                            <span class="badge {{ $return_item->fine_paid ? 'badge-paid' : 'badge-unpaid' }}">
                                {{ $return_item->fine_paid ? 'Paid' : 'Unpaid' }}
                            </span>
                        @else
                            <span style="color: #64748b;">No fine</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center" style="padding: 40px; color: #64748b;">
                        <span style="font-size: 16px; font-weight: 500; color: #475569;">No Return Records Found</span>
                        <br>
                        <span style="font-size: 13px; margin-top: 4px; display: inline-block;">
                            There are no return records matching your filter criteria.
                        </span>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("Inter, Helvetica, Arial, sans-serif", "normal");
            $size = 9;
            $pageText = "Page {PAGE_NUM} of {PAGE_COUNT}";
            $y = $pdf->get_height() - 24;
            $x = $pdf->get_width() - 15 - $fontMetrics->get_text_width($pageText, $font, $size);
            $pdf->page_text($x, $y, $pageText, $font, $size, array(0.58, 0.63, 0.72));
        }
    </script>

</body>
</html>
