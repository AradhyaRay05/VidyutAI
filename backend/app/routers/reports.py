import io
import numpy as np
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from fpdf import FPDF

from app.core.deps import get_current_user
from app.services.db_service import db_service

router = APIRouter(prefix="/api/reports", tags=["reports"])


class EnergyReport(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(123, 57, 252)
        self.cell(0, 8, "VidyutAI - Energy Intelligence Report", align="L")
        self.set_font("Helvetica", "", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 8, f"Generated: {datetime.now().strftime('%d %b %Y, %I:%M %p')}", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(123, 57, 252)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"VidyutAI Energy Intelligence Platform | Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title):
        self.ln(4)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(43, 35, 68)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(123, 57, 252)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 80, self.get_y())
        self.ln(4)

    def stat_card(self, label, value, x, y, w=42, h=22):
        self.set_xy(x, y)
        self.set_fill_color(245, 245, 248)
        self.rect(x, y, w, h, "F")
        self.set_font("Helvetica", "", 8)
        self.set_text_color(128, 128, 128)
        self.set_xy(x + 3, y + 3)
        self.cell(w - 6, 5, label)
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(43, 35, 68)
        self.set_xy(x + 3, y + 10)
        self.cell(w - 6, 8, str(value))

    def table_row(self, cols, widths, bold=False, fill=False):
        self.set_font("Helvetica", "B" if bold else "", 9)
        if fill:
            self.set_fill_color(245, 245, 248)
        self.set_text_color(43, 35, 68)
        h = 7
        for i, (col, w) in enumerate(zip(cols, widths)):
            self.cell(w, h, str(col)[:int(w/2)], border=0, fill=fill)
        self.ln(h)


def _get_data(user_id):
    daily = []
    appliances = []
    try:
        daily = db_service.get_daily_consumption(user_id, days=30) or []
    except Exception:
        pass
    try:
        appliances = db_service.get_appliance_consumption(user_id) or []
    except Exception:
        pass
    return daily, appliances


@router.get("/pdf")
async def generate_pdf_report(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    tariff = float(current_user.get("tariff_rate", 7.0))
    daily, appliances = _get_data(user_id)

    pdf = EnergyReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    # --- Cover info ---
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(43, 35, 68)
    pdf.ln(5)
    pdf.cell(0, 12, "Energy Intelligence Report", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, f"Prepared for: {current_user.get('full_name', current_user['username'])}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"Report Period: Last 30 Days | Tariff Rate: Rs.{tariff}/kWh", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # --- Stats ---
    if daily:
        values = [float(d["total_kwh"]) for d in daily]
        costs = [float(d["total_cost"]) for d in daily]
        total_kwh = sum(values)
        total_cost = sum(costs)
        avg_daily = np.mean(values)
        carbon = total_kwh * 0.82
        efficiency = max(0, 100 - (avg_daily / 30 * 100))

        y = pdf.get_y()
        pdf.stat_card("Total Usage", f"{total_kwh:.0f} kWh", 10, y)
        pdf.stat_card("Total Cost", f"Rs.{total_cost:.0f}", 56, y)
        pdf.stat_card("Avg Daily", f"{avg_daily:.1f} kWh", 102, y)
        pdf.stat_card("Efficiency", f"{efficiency:.0f}/100", 148, y)
        pdf.set_y(y + 28)

        y = pdf.get_y()
        pdf.stat_card("Carbon Footprint", f"{carbon:.1f} kg", 10, y)
        pdf.stat_card("Peak Day", f"{max(values):.1f} kWh", 56, y)
        pdf.stat_card("Lowest Day", f"{min(values):.1f} kWh", 102, y)
        pdf.stat_card("Days Tracked", f"{len(daily)}", 148, y)
        pdf.set_y(y + 28)
    else:
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 8, "No consumption data available. Upload data to generate a full report.", new_x="LMARGIN", new_y="NEXT")

    # --- Appliance Breakdown ---
    if appliances:
        pdf.section_title("Appliance Breakdown")
        total_appliance_kwh = sum(float(a["total_kwh"]) for a in appliances)
        widths = [10, 60, 35, 35, 30]
        pdf.table_row(["#", "Appliance", "kWh", "Cost (Rs.)", "Share"], widths, bold=True, fill=True)
        for i, a in enumerate(appliances[:10], 1):
            kwh = float(a["total_kwh"])
            cost = float(a["total_cost"])
            pct = (kwh / total_appliance_kwh * 100) if total_appliance_kwh > 0 else 0
            pdf.table_row(
                [str(i), a["appliance_name"], f"{kwh:.1f}", f"{cost:.0f}", f"{pct:.0f}%"],
                widths, fill=(i % 2 == 0),
            )

    # --- Daily Consumption ---
    if daily:
        pdf.section_title("Daily Consumption Log")
        widths = [15, 35, 35, 35, 35]
        pdf.table_row(["Day", "Date", "kWh", "Cost (Rs.)", "vs Average"], widths, bold=True, fill=True)
        avg_kwh = np.mean([float(d["total_kwh"]) for d in daily])
        for i, d in enumerate(daily[:20], 1):
            date_str = d["date"].strftime("%d-%b") if hasattr(d["date"], "strftime") else str(d["date"])[:5]
            kwh = float(d["total_kwh"])
            cost = float(d["total_cost"])
            vs_avg = ((kwh / avg_kwh) - 1) * 100 if avg_kwh > 0 else 0
            sign = "+" if vs_avg >= 0 else ""
            pdf.table_row(
                [str(i), date_str, f"{kwh:.1f}", f"{cost:.0f}", f"{sign}{vs_avg:.0f}%"],
                widths, fill=(i % 2 == 0),
            )

    # --- Predictions ---
    pdf.section_title("AI Predictions (Next 7 Days)")
    try:
        from app.services.ml_service import ml_service
        historical_df = db_service.get_data_as_dataframe(user_id)
        if not historical_df.empty and len(historical_df) >= 7:
            preds = ml_service.predict_next_days(historical_df, days=7, tariff_rate=tariff)
            widths = [15, 40, 35, 35, 35]
            pdf.table_row(["#", "Date", "Predicted kWh", "Predicted Cost", "Confidence"], widths, bold=True, fill=True)
            for i, (_, row) in enumerate(preds.iterrows(), 1):
                date_str = row["date"].strftime("%d-%b") if hasattr(row["date"], "strftime") else str(row["date"])[:5]
                pdf.table_row(
                    [str(i), date_str, f"{row['predicted_kwh']:.1f}", f"Rs.{row['predicted_cost']:.0f}", f"{row['confidence_score']*100:.0f}%"],
                    widths, fill=(i % 2 == 0),
                )
        else:
            pdf.set_font("Helvetica", "I", 10)
            pdf.set_text_color(128, 128, 128)
            pdf.cell(0, 8, "Need at least 7 days of data for AI predictions.", new_x="LMARGIN", new_y="NEXT")
    except Exception as e:
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 8, f"Predictions unavailable: {str(e)[:80]}", new_x="LMARGIN", new_y="NEXT")

    # --- Recommendations ---
    pdf.section_title("AI Recommendations")
    if appliances:
        top = appliances[0]
        top_name = top["appliance_name"]
        top_cost = float(top["total_cost"])
        avg_daily_val = np.mean([float(d["total_kwh"]) for d in daily]) if daily else 25

        recs = [
            f"1. Optimize {top_name} (highest consumer at Rs.{top_cost:.0f}/month). Consider upgrading to energy-efficient model. Potential savings: Rs.{top_cost*0.25:.0f}/month.",
            f"2. Shift high-power appliance usage to off-peak hours (10 PM - 6 AM) to reduce tariff costs by up to 30%.",
            f"3. Eliminate standby power drain with smart power strips. Estimated savings: Rs.{np.mean(costs)*0.08*30:.0f}/month." if daily else "3. Eliminate standby power drain with smart power strips.",
            f"4. Monitor daily consumption consistency. Your standard deviation is {np.std([float(d['total_kwh']) for d in daily]):.1f} kWh. Lower variation means predictable bills.",
            "5. Consider solar panel installation for long-term savings of Rs.900+/month.",
        ]
    else:
        recs = [
            "1. Upload your appliance-level consumption data for personalized recommendations.",
            "2. Track daily usage for at least 2 weeks for accurate AI analysis.",
            "3. Consider a home energy audit to identify major consumption sources.",
        ]

    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(60, 60, 60)
    for rec in recs:
        pdf.multi_cell(0, 6, rec, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

    # --- Disclaimer ---
    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(160, 160, 160)
    pdf.multi_cell(0, 5, "This report is generated by VidyutAI's machine learning models based on your uploaded data. Predictions are estimates and may vary from actual consumption. For best results, ensure accurate and consistent data entry.")

    # Output
    pdf_bytes = bytes(pdf.output())
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=VidyutAI_Report_{datetime.now().strftime('%Y%m%d')}.pdf"},
    )
