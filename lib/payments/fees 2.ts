// ─── Fee constants ────────────────────────────────────────────────────────────
// Formula:
//   passenger_fee   = base × 5%          ← charged ON TOP to passenger
//   subtotal        = base + passenger_fee
//   IVA             = subtotal × 16%
//   total_w_vat     = subtotal + IVA
//   stripe_fee      = total_w_vat × 2.9% + $0.30
//   total_paid      = total_w_vat + stripe_fee
//   owner_net       = base × 95%         ← owner keeps base minus 5%
//   mobius_total    = passenger_fee(5%) + owner_commission(5%) = 10% of base

export const FEE_RATES = {
    PASSENGER_FEE:      0.05,   // 5% added on top of base price to passenger
    OWNER_COMMISSION:   0.05,   // 5% deducted from base price from owner
    VAT:                0.16,   // 16% IVA on (base + passenger fee)
    STRIPE_PERCENTAGE:  0.029,  // 2.9% Stripe processing fee (on total incl. IVA)
    STRIPE_FIXED:       0.30,   // $0.30 MXN fixed Stripe fee
} as const;

export interface PaymentBreakdown {
    base_price:                  number;
    passenger_fee_rate:          number;
    mobius_commission_rate:      number;
    vat_rate:                    number;
    passenger_fee_amount:        number;   // 5% charged to passenger
    mobius_commission_amount:    number;   // 5% deducted from owner
    mobius_commission_vat_amount:number;   // IVA on Mobius commission
    vat_amount_total:            number;   // Total IVA paid by passenger
    stripe_fee_amount:           number;   // Stripe processing fee
    amount_total_paid:           number;   // What passenger actually pays
    amount_owner_net:            number;   // What owner receives
    amount_mobius_total:         number;   // What Mobius earns (10% of base)
}

/**
 * Calculates the full payment breakdown for a booking.
 *
 * Example with base = $10,000 MXN:
 *   passenger_fee   = 10,000 × 5%          =    500
 *   subtotal        = 10,000 + 500          = 10,500
 *   IVA             = 10,500 × 16%          =  1,680
 *   total_w_vat     = 10,500 + 1,680        = 12,180
 *   stripe_fee      = 12,180 × 2.9% + 0.30 ≈   353.52
 *   total_paid      = 12,180 + 353.52       ≈ 12,533.52
 *   owner_net       = 10,000 × 95%          =  9,500
 *   mobius_total    = 500 + 500             =  1,000 (10% of base)
 *
 * @param basePrice - Owner-set price (price_per_seat × seats OR price_full_aircraft)
 */
export function calculatePaymentBreakdown(basePrice: number): PaymentBreakdown {
    const round = (n: number) => Math.round(n * 100) / 100;

    const passenger_fee_amount          = round(basePrice * FEE_RATES.PASSENGER_FEE);
    const mobius_commission_amount      = round(basePrice * FEE_RATES.OWNER_COMMISSION);
    const subtotal                      = basePrice + passenger_fee_amount;
    const vat_amount_total              = round(subtotal * FEE_RATES.VAT);
    const subtotal_with_vat             = subtotal + vat_amount_total;
    const stripe_fee_amount             = round(subtotal_with_vat * FEE_RATES.STRIPE_PERCENTAGE + FEE_RATES.STRIPE_FIXED);
    const amount_total_paid             = round(subtotal_with_vat + stripe_fee_amount);

    const mobius_commission_vat_amount  = round(mobius_commission_amount * FEE_RATES.VAT);
    const amount_owner_net              = round(basePrice * (1 - FEE_RATES.OWNER_COMMISSION));
    const amount_mobius_total           = round(passenger_fee_amount + mobius_commission_amount);

    return {
        base_price:                   round(basePrice),
        passenger_fee_rate:           FEE_RATES.PASSENGER_FEE,
        mobius_commission_rate:       FEE_RATES.OWNER_COMMISSION,
        vat_rate:                     FEE_RATES.VAT,
        passenger_fee_amount,
        mobius_commission_amount,
        mobius_commission_vat_amount,
        vat_amount_total,
        stripe_fee_amount,
        amount_total_paid,
        amount_owner_net,
        amount_mobius_total,
    };
}
