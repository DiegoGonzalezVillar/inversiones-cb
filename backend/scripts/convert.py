import pandas as pd
import numpy as np
import os
import sys
import csv

# -----------------------------------------
# Helpers
# -----------------------------------------

def to_float(x):
    if isinstance(x, (int, float, np.number)) and not pd.isna(x):
        return float(x)

    if pd.isna(x):
        return 0.0

    s = str(x).strip()
    if s == "":
        return 0.0

    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    else:
        s = s.replace(",", "")

    try:
        return float(s)
    except:
        return 0.0

def fmt2(x):
    return f"{float(x):.2f}"

moneda_map = {"UYU": "0", "USD": "1"}

def blank():
    return " "

def s(x):
    return "" if pd.isna(x) else str(x).strip()

def safe_csv_field(x):
    x = s(x)
    return x.replace(",", " ").replace("\n", " ").replace("\r", " ")

header_cols = ["DIA","DEBE","HABER","CENTRODECOSTOS","RUC","CONCEPTO","MONEDA","TOTAL","CODIGODEIVA","IVA","LIBRO"]

def generar_txt(df_sub, out_path):
    with open(out_path, "w", encoding="cp1252", newline="") as f:
        w = csv.writer(f, delimiter=",", lineterminator="\n")
        w.writerow(header_cols)

        for _, row in df_sub.iterrows():
            fecha = pd.to_datetime(row.get("Fecha Emisión", ""), dayfirst=True, errors="coerce")
            dia = str(int(fecha.day)) if pd.notna(fecha) else blank()

            ruc = safe_csv_field(row.get("RUT/CI/Doc", ""))
            tipo = safe_csv_field(row.get("Tipo", ""))
            numero = safe_csv_field(row.get("Número", ""))
            receptor = safe_csv_field(row.get("Receptor", ""))
            concepto = f"{tipo}-{numero}-{receptor}"

            moneda_raw = s(row.get("Moneda", "")).upper()
            moneda = moneda_map.get(moneda_raw, moneda_raw)

            exento = to_float(row.get("Exento IVA", 0))
            total_gravado = to_float(row.get("Total Gravado", 0))
            monto_total = to_float(row.get("Monto Total", 0))

            iva_basico = to_float(row.get("IVA Básico", 0))
            iva_minimo = to_float(row.get("IVA Mínimo", 0))
            iva_suspenso = to_float(row.get("IVA Suspenso", 0))
            iva_total = iva_minimo + iva_basico + iva_suspenso

            cuenta_gravado = str(int(row["cuenta"]))
            cuenta_exento = "4101"
            cuenta_haber_iva = "21332"
            cuenta_debe = "11111"

            if abs(exento) > 1e-9:
                w.writerow([dia, "", cuenta_exento, "", ruc, concepto, moneda, fmt2(exento), "", "", "V"])

            w.writerow([dia, "", cuenta_gravado, "", ruc, concepto, moneda, fmt2(total_gravado), "", "", "V"])
            w.writerow([dia, "", cuenta_haber_iva, "", ruc, concepto, moneda, fmt2(iva_total), "", "", "V"])
            w.writerow([dia, cuenta_debe, "", "", ruc, concepto, moneda, fmt2(monto_total), "", "", "V"])

# -----------------------------------------
# MAIN
# -----------------------------------------

def main():
    if len(sys.argv) < 3:
        print("Uso: python convert.py <input.xls|xlsx> <output.txt>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(input_path):
        print("ERROR: No existe el archivo de entrada:", input_path)
        sys.exit(1)

    # ✅ Leer Excel (tu lógica original)
    df = pd.read_excel(
        input_path,
        engine="xlrd" if input_path.lower().endswith(".xls") else None,
        skiprows=5,
        dtype={"RUT/CI/Doc": str}
    )

    # Guardar última fila (Serie) (en tu script lo hacías aunque no lo uses)
    ultima_fila = df.iloc[-1].copy()

    # Eliminar últimas 2 filas
    df = df.iloc[:-2].reset_index(drop=True)

    # Split serie-numero desde la 2da columna
    col = df.columns[1]
    df[['serie', 'numero']] = (
        df[col].astype(str)
              .str.split('-', n=1, expand=True)
              .apply(lambda s: s.str.strip())
    )

    # Reemplazo Moneda
    df['Moneda'] = df['Moneda'].replace('USD', 'UYU')

    # Filtrar cobranza
    mask = ~df['Tipo'].astype(str).str.strip().str.casefold().str.contains('cobranza', na=False)
    df = df[mask].reset_index(drop=True)

    # Normalizar columnas numéricas (10..17)
    cols = df.columns[10:18]
    for c in cols:
        df[c] = pd.to_numeric(
            df[c].astype(str).str.replace(',', '.', regex=False),
            errors='coerce'
        )

    for c in cols:
        df[c] = df[c].map(lambda v: f"{v:.2f}".replace('.', ',') if pd.notna(v) else v)

    cols_sum = df.columns[10:18]
    col_17 = df.columns[16]
    cols_sum = [c for c in cols_sum if c != col_17]

    tmp = df[cols_sum].apply(lambda s: pd.to_numeric(
        s.astype(str).str.replace(',', '.', regex=False),
        errors='coerce'
    ))

    df['Monto Total'] = tmp.sum(axis=1, skipna=True)

    # -----------------------------
    # CUENTA (tu lógica)
    # -----------------------------
    df['cuenta'] = np.nan
    df['Sucursal'] = pd.to_numeric(df['Sucursal'], errors='coerce')

    receptor_norm = df['Receptor'].astype(str).str.strip().str.casefold()
    doc_norm = df['RUT/CI/Doc'].astype(str).str.strip()

    df.loc[df['Sucursal'] == 5, 'cuenta'] = 4107

    mask = receptor_norm == "administración nacional de usinas y trasmisiones eléctricas".casefold()
    df.loc[mask, 'cuenta'] = 4106

    mask = receptor_norm == "montevideo refrescos s.r.l".casefold()
    df.loc[mask, 'cuenta'] = 4105

    mask_4102 = (df['Sucursal'] == 1) & (df['RUT/CI/Doc'].isna() | (doc_norm == ""))
    df.loc[mask_4102 & df['cuenta'].isna(), 'cuenta'] = 4102

    df.loc[df['cuenta'].isna(), 'cuenta'] = 4103
    df['cuenta'] = df['cuenta'].astype('Int64')

    # Generar output
    df_ok = df.dropna(subset=["Fecha Emisión"]).copy()
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    generar_txt(df_ok, output_path)
    print("OK. Archivo creado en:", output_path)

if __name__ == "__main__":
    main()
