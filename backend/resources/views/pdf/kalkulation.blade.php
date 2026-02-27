<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: DejaVu Sans, sans-serif; font-size:12px; }
.topbar {
  text-align:center;
  font-size:10px;
  padding:6px 0;
  border-bottom:1px solid #eee;
  color:#1e5aa8;
}
.logo { margin-top:20px; }
.title {
  text-align:center;
  font-size:24px;
  font-weight:bold;
  margin:30px 0 20px;
}
.meta { margin-bottom:25px; }
.meta td { padding:3px 0; }

.table {
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
}
.table th {
  border-bottom:2px solid #000;
  text-align:left;
  padding:8px;
}
.table td {
  padding:8px;
}
.table td.r { text-align:right; }

.page-break { page-break-after:always; }

.summary {
  width:100%;
  border-collapse:collapse;
  margin-top:40px;
}
.summary th, .summary td {
  border:1px solid #333;
  padding:6px;
}
.summary td.r { text-align:right; }

.signature {
  margin-top:60px;
}
.line {
  border-bottom:1px solid #000;
  height:20px;
  margin-top:40px;
}
</style>
</head>
<body>

<div class="topbar">
GERSTL BAU GmbH & Co KG | +43 (0) 1/4025149 | sanierung-wien@gerstl.at
</div>

<div class="logo">
<img src="{{ public_path('pdf/logo.png') }}" style="width:260px;">
</div>

<div class="title">
Übersicht Ihrer gewählten Produkte
</div>

<table class="meta">
<tr>
<td><b>Auftraggeber:</b></td>
<td>{{ $k->customer }}</td>
</tr>
<tr>
<td><b>Adresse:</b></td>
<td>{{ $k->address }}</td>
</tr>
<tr>
<td><b>Datum:</b></td>
<td>{{ \Carbon\Carbon::parse($k->created_at_date)->format('d.m.Y') }}</td>
</tr>
</table>

<table class="table">
<thead>
<tr>
<th>Leistung</th>
<th style="text-align:right;">Preis</th>
</tr>
</thead>
<tbody>
@foreach($lines as $line)
<tr>
<td>{{ $line['label'] }}</td>
<td class="r">{{ number_format($line['price'], 2, ',', '.') }}</td>
</tr>
@endforeach
</tbody>
</table>

<div class="page-break"></div>

<div class="title">Zusammenstellung der Gewerkkosten</div>

<table class="summary">
<tr>
<th>Gewerk</th>
<th>Gesamtpreis</th>
</tr>

@foreach($gewerkSummary as $g)
<tr>
<td>{{ $g['title'] }}</td>
<td class="r">{{ number_format($g['price'], 2, ',', '.') }}</td>
</tr>
@endforeach

<tr>
<td><b>Gesamtsumme</b></td>
<td class="r"><b>{{ number_format($k->grand_total, 2, ',', '.') }}</b></td>
</tr>
</table>

<div class="signature">
Bitte unterschreiben Sie das Angebot und senden Sie es an uns zurück.
<div class="line"></div>
Auftraggeber
</div>

</body>
</html>