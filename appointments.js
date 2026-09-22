// api/appointments.js
// Salon Booking API — Supabase se juda hua
//
//   GET  /api/appointments  -> saari bookings padho   (READ)
//   POST /api/appointments  -> nayi booking likho     (WRITE)

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // ---------- READ ----------
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_time", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ---------- WRITE ----------
  if (req.method === "POST") {
    const {
      customer_name,
      phone,
      service,
      stylist,
      appointment_time
    } = req.body || {};

    if (!customer_name || !phone || !service || !appointment_time) {
      return res.status(400).json({
        error: "customer_name, phone, service and appointment_time are required"
      });
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          customer_name,
          phone,
          service,
          stylist: stylist || "Any",
          appointment_time
        }
      ])
      .select()
      .single();

    if (error) {
      // 23505 = unique constraint toota -> slot pehle se booked hai
      if (error.code === "23505") {
        return res.status(409).json({ error: "That slot is already booked" });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Only GET and POST are allowed" });
}
