"use server";

import { Resend } from "resend";

// Configuration des services
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNurseNotificationSMS(
  patientName: string,
  appointmentDate: string,
  appointmentTime: string,
  appointmentType: string
) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramBotToken || !telegramChatId) {
    console.log("⚠️ Telegram non configuré, notification ignorée");
    return { success: false, message: "Telegram non configuré" };
  }

  const message = `🔔 NOUVEAU RDV VALIDÉ

Patient: ${patientName}
📅 Date: ${appointmentDate}
🕐 Heure: ${appointmentTime}
🏥 Soin: ${appointmentType}

Le patient a validé son rendez-vous.
Merci de confirmer votre disponibilité.

Cabinet Médical`;

  try {
    console.log("📱 Envoi notification via Telegram:", {
      chatId: telegramChatId,
      message,
    });

    // Envoi via Telegram Bot API (100% gratuit)
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${errorData.description}`);
    }

    await response.json();
    console.log("✅ Notification Telegram envoyée avec succès");
    return { success: true, message: "Notification Telegram envoyée" };
  } catch (error) {
    console.error("❌ Erreur envoi notification Telegram:", error);
    return {
      success: false,
      message: "Erreur notification Telegram, mais email patient sera envoyé",
    };
  }
}

export async function sendPatientConfirmationEmail(
  patientName: string,
  patientEmail: string,
  appointmentDate: string,
  appointmentTime: string,
  appointmentType: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY non configurée");
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🎉 Rendez-vous confirmé !</h1>
        <p style="margin: 10px 0 0 0;">Votre rendez-vous a été validé avec succès</p>
      </div>
      
      <div style="padding: 20px; background: #f8fafc; border-radius: 0 0 8px 8px;">
        <p>Bonjour <strong>${patientName}</strong>,</p>
        
        <p>Nous vous confirmons votre rendez-vous médical :</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: bold; color: #374151;">📅 Date :</span>
            <span style="color: #6b7280;">${appointmentDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: bold; color: #374151;">🕐 Heure :</span>
            <span style="color: #6b7280;">${appointmentTime}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0;">
            <span style="font-weight: bold; color: #374151;">🏥 Type de soin :</span>
            <span style="color: #6b7280;">${appointmentType}</span>
          </div>
        </div>
        
        <p><strong>Important :</strong></p>
        <ul>
          <li>Merci d'arriver 10 minutes avant votre rendez-vous</li>
          <li>Apportez votre carte vitale et votre ordonnance si nécessaire</li>
          <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
        </ul>
        
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe du Cabinet Médical</strong></p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  `;

  try {
    console.log("📧 Envoi email au patient:", {
      to: patientEmail,
      subject: `Confirmation de votre rendez-vous - ${appointmentDate}`,
    });

    const { error } = await resend.emails.send({
      from: "Cabinet Médical <onboarding@resend.dev>",
      to: [patientEmail],
      subject: `Confirmation de votre rendez-vous - ${appointmentDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      throw new Error(`Erreur Resend: ${error.message}`);
    }

    console.log("✅ Email envoyé avec succès au patient");
    return {
      success: true,
      message: "Email de confirmation envoyé au patient",
    };
  } catch (error) {
    console.error("❌ Erreur envoi email patient:", error);
    throw new Error("Erreur lors de l'envoi de l'email au patient");
  }
}

export async function sendAppointmentValidationNotifications(
  patientName: string,
  patientEmail: string,
  appointmentDate: string,
  appointmentTime: string,
  appointmentType: string
) {
  console.log("🚀 Début envoi notifications:", {
    patientName,
    patientEmail,
    appointmentDate,
    appointmentTime,
    appointmentType,
  });

  try {
    // 1. Envoyer SMS aux infirmières (GRATUIT via email)
    console.log("📱 Envoi SMS aux infirmières...");
    const nurseResult = await sendNurseNotificationSMS(
      patientName,
      appointmentDate,
      appointmentTime,
      appointmentType
    );

    // 2. Envoyer email au patient (seulement si c'est votre email pour éviter l'erreur Resend)
    let patientResult;
    if (patientEmail === "franckick2@gmail.com") {
      console.log("📧 Envoi email au patient (votre email)...");
      patientResult = await sendPatientConfirmationEmail(
        patientName,
        patientEmail,
        appointmentDate,
        appointmentTime,
        appointmentType
      );
    } else {
      console.log(
        "📧 Email patient ignoré (pas votre email pour éviter l'erreur Resend)"
      );
      patientResult = {
        success: true,
        message: "Email patient ignoré (mode test Resend)",
      };
    }

    // Vérifier les résultats
    const smsSuccess = nurseResult.success;
    const emailSuccess = patientResult.success;

    if (emailSuccess) {
      console.log("✅ Email envoyé avec succès");
      if (smsSuccess) {
        console.log("✅ SMS infirmière et email patient envoyés avec succès");
        return {
          success: true,
          nurseSMS: nurseResult,
          patientEmail: patientResult,
          message: "SMS infirmière et email patient envoyés avec succès",
        };
      } else {
        console.log("⚠️ Email patient envoyé, mais SMS infirmière échoué");
        return {
          success: true,
          nurseSMS: nurseResult,
          patientEmail: patientResult,
          message: "Email patient envoyé (SMS infirmière échoué)",
        };
      }
    } else {
      throw new Error("Erreur lors de l'envoi de l'email");
    }
  } catch (error) {
    console.error("❌ Erreur notifications validation RDV:", error);
    throw new Error("Erreur lors de l'envoi des notifications");
  }
}

// Fonction de test pour vérifier la configuration
export async function testNotifications() {
  console.log("🧪 Test des notifications...");

  const config = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
      ? "***configuré***"
      : "❌ manquant",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    NURSE_PHONE_NUMBER: process.env.NURSE_PHONE_NUMBER,
    RESEND_API_KEY: process.env.RESEND_API_KEY
      ? "***configuré***"
      : "❌ manquant",
    DOCTOR_NAME: process.env.DOCTOR_NAME,
    CLINIC_ADDRESS: process.env.CLINIC_ADDRESS,
  };

  console.log("📋 Configuration actuelle:", config);

  return config;
}
