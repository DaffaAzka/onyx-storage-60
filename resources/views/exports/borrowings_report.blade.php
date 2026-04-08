<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Borrowings Report</title>
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
        .badge-pending  { background-color: #fef9c3; color: #854d0e; }
        .badge-approved { background-color: #dbeafe; color: #1e40af; }
        .badge-rejected { background-color: #fee2e2; color: #991b1b; }
        .badge-borrowed { background-color: #f3e8ff; color: #6b21a8; }
        .badge-returned { background-color: #dcfce3; color: #166534; }
        .badge-late     { background-color: #fee2e2; color: #991b1b; }

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
        <h1>Borrowings Report</h1>
        <p>Generated on {{ now()->format('F j, Y, g:i A') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">No</th>
                <th style="width: 25%;">Item Name</th>
                <th style="width: 15%;">Borrower</th>
                <th style="width: 15%;">Approver</th>
                <th style="width: 8%; text-align: center;">Qty</th>
                <th style="width: 16%;">Borrow Date</th>
                <th style="width: 16%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($borrowings as $index => $borrowing)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <div class="item-name">{{ $borrowing->item->name ?? 'N/A' }}</div>
                        <div class="text-muted">{{ $borrowing->item->category->name ?? 'No Category' }}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500; color: #0f172a;">{{ $borrowing->borrower->name ?? 'N/A' }}</div>
                        <div class="text-muted">{{ $borrowing->borrower->email ?? '' }}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500; color: #0f172a;">{{ $borrowing->approver->name ?? '-' }}</div>
                        @if($borrowing->approver)
                            <div class="text-muted">Role: {{ ucfirst($borrowing->approver->role ?? 'N/A') }}</div>
                        @endif
                    </td>
                    <td class="text-center">{{ $borrowing->quantity }}</td>
                    <td>
                        <div style="font-weight: 500; color: #334155;">
                            {{ \Carbon\Carbon::parse($borrowing->borrow_date)->format('d M Y') }}
                        </div>
                        <div class="text-muted">
                            Return: {{ \Carbon\Carbon::parse($borrowing->planned_return_date)->format('d M Y') }}
                        </div>
                    </td>
                    <td>
                        @php
                            $statusClass = match($borrowing->status) {
                                'approved' => 'badge-approved',
                                'rejected' => 'badge-rejected',
                                'borrowed' => 'badge-borrowed',
                                'returned' => 'badge-returned',
                                'late'     => 'badge-late',
                                default    => 'badge-pending',
                            };
                        @endphp
                        <span class="badge {{ $statusClass }}">
                            {{ ucfirst($borrowing->status) }}
                        </span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center" style="padding: 40px; color: #64748b;">
                        <span style="font-size: 16px; font-weight: 500; color: #475569;">No Borrowing Records Found</span>
                        <br>
                        <span style="font-size: 13px; margin-top: 4px; display: inline-block;">
                            There are no borrowing records matching your filter criteria.
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
