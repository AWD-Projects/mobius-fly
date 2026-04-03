// ─── Fee constants (confirmed in Mobius meeting 2026-03-30) ──────────────────
// Formula agreed with Eduardo Martínez:
//   commission  = base × 10%
//   subtotal    = base + commission
//   IVA         = subtotal × 16%
//   total_w_vat = subtotal + IVA
//   stripe_fee  = total_w_vat × 2.9% + $0.30   ← applied last on full total
//   total_paid  = total_w_vat + stripe_fee
//   owner_net   = base × 90%   (base minus 10% commission, no IVA deducted)
// All funds go to Mobius Stripe account; owner payouts are manual.

export const FEE_RATES = {
    MOBIUS_COMMISSION:  0.10,   // 10% service charge added to passenger total
    VAT:                0.16,   // 16% IVA on (base + commission)
    STRIPE_PERCENTAGE:  0.029,  // 2.9% Stripe processing fee (on total incl. IVA)
    STRIPE_FIXED:       0.30,   // $0.30 MXN fixed Stripe fee
} as const;

export interface PaymentBreakdown {
    base_price:                  number;
    passenger_fee_rate:          number;
    mobius_commission_rate:      number;
    vat_rate:                    number;
    passenger_fee_amount:        number;   // Mobius commission from passenger
    mobius_commission_amount:    number;   // Mobius commission from owner side
    mobius_commission_vat_amount:number;   // IVA on Mobius commission (owner)
    vat_amount_total:            number;   // Total IVA paid by passenger
    stripe_fee_amount:           number;   // Stripe processing fee
    amount_total_paid:           number;   // What passenger actually pays
    amount_owner_net:            number;   // What owner receives
    amount_mobius_total:         number;   // What Mobius earns
}

/**
 * Calculates the full payment breakdown for a booking.
 *
 * Example with base = $10,000 MXN:
 *   commission      = 10,000 × 10%          = 1,000
 *   subtotal        = 10,000 + 1,000         = 11,000
 *   IVA             = 11,000 × 16%           = 1,760
 *   total_w_vat     = 11,000 + 1,760         = 12,760
 *   stripe_fee      = 12,760 × 2.9% + 0.30  ≈ 370.34
 *   total_paid      = 12,760 + 370.34        ≈ 13,130.34
 *   owner_net       = 10,000 × 90%           = 9,000
 *
 * @param basePrice - Owner-set price (price_per_seat × seats OR price_full_aircraft)
 */
export function calculatePaymentBreakdown(basePrice: number): PaymentBreakdown {
    const round = (n: number) => Math.round(n * 100) / 100;

    const mobius_commission_amount      = round(basePrice * FEE_RATES.MOBIUS_COMMISSION);
    const subtotal                      = basePrice + mobius_commission_amount;
    const vat_amount_total              = round(subtotal * FEE_RATES.VAT);
    const subtotal_with_vat             = subtotal + vat_amount_total;
    const stripe_fee_amount             = round(subtotal_with_vat * FEE_RATES.STRIPE_PERCENTAGE + FEE_RATES.STRIPE_FIXED);
    const amount_total_paid             = round(subtotal_with_vat + stripe_fee_amount);

    const mobius_commission_vat_amount  = round(mobius_commission_amount * FEE_RATES.VAT);
    const amount_owner_net              = round(basePrice * (1 - FEE_RATES.MOBIUS_COMMISSION));
    const amount_mobius_total           = round(amount_total_paid - amount_owner_net - stripe_fee_amount);

    return {
        base_price:                   round(basePrice),
        passenger_fee_rate:           FEE_RATES.MOBIUS_COMMISSION,
        mobius_commission_rate:       FEE_RATES.MOBIUS_COMMISSION,
        vat_rate:                     FEE_RATES.VAT,
        passenger_fee_amount:         mobius_commission_amount,
        mobius_commission_amount,
        mobius_commission_vat_amount,
        vat_amount_total,
        stripe_fee_amount,
        amount_total_paid,
        amount_owner_net,
        amount_mobius_total,
    };
}
