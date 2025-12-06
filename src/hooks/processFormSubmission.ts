import type { BusinessInfo } from '@/payload-types';
import type { CollectionAfterChangeHook, Payload } from 'payload';

/**
 * Form Submission Processing Hook (Simplified)
 *
 * All form data is stored in form-submissions collection.
 * This hook handles:
 * - Sending notification emails (for all form types)
 * - Adding to newsletter subscribers (only for newsletter type)
 *
 * The formType determines what additional actions to take.
 */

type FormType =
  | 'contact'
  | 'newsletter'
  | 'booking'
  | 'order'
  | 'feedback'
  | 'other';

interface FormSubmissionData {
  form: {
    id: string;
    title?: string;
    formType?: FormType;
  };
  submissionData: Array<{
    field: string;
    value: string;
  }>;
}

// Helper to extract field value from submission data
const getFieldValue = (
  submissionData: Array<{ field: string; value: string }>,
  fieldName: string,
): string | undefined => {
  const field = submissionData.find(
    f =>
      f.field.toLowerCase() === fieldName.toLowerCase() ||
      f.field === fieldName,
  );
  return field?.value;
};

// Get display name from submission (tries multiple field names)
const getDisplayName = (
  submissionData: Array<{ field: string; value: string }>,
): string => {
  const lastName =
    getFieldValue(submissionData, 'lastName') ||
    getFieldValue(submissionData, 'nume');
  const firstName =
    getFieldValue(submissionData, 'firstName') ||
    getFieldValue(submissionData, 'prenume');
  const name = getFieldValue(submissionData, 'name');

  if (lastName && firstName) return `${lastName} ${firstName}`;
  if (name) return name;
  if (lastName) return lastName;
  if (firstName) return firstName;
  return 'vizitator';
};

// Send notification email (used for all form types except newsletter)
const sendNotificationEmail = async (
  doc: FormSubmissionData,
  payload: Payload,
  businessInfo: BusinessInfo | null,
): Promise<void> => {
  const { submissionData, form } = doc;
  const businessName = businessInfo?.name || 'Website';
  const businessEmail = businessInfo?.email;

  const name = getDisplayName(submissionData);
  const email = getFieldValue(submissionData, 'email');
  const subject =
    getFieldValue(submissionData, 'subject') ||
    getFieldValue(submissionData, 'subiect');

  // Build submission details HTML
  const submissionDetails = submissionData
    .map(
      field =>
        `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${field.field}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${field.value}</td></tr>`,
    )
    .join('');

  // Use business email as recipient
  if (!businessEmail) {
    console.warn('No business email configured - skipping notification');
    return;
  }

  // Customize subject based on form type
  const formType = form.formType || 'contact';
  const emailSubjects: Record<string, string> = {
    contact: `Mesaj nou de contact de la ${name}${subject ? `: ${subject}` : ''}`,
    booking: `Cerere de programare de la ${name}`,
    order: `Comanda noua de la ${name}`,
    feedback: `Feedback nou de la ${name}`,
    other: `Formular nou: ${form.title}`,
  };

  const emailSubject = `[${businessName}] ${emailSubjects[formType] || emailSubjects.other}`;

  await payload.sendEmail({
    to: businessEmail,
    replyTo: email,
    subject: emailSubject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          ${form.title || 'Formular nou'}
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          ${submissionDetails}
        </table>

        ${email ? `<p><a href="mailto:${email}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Raspunde la ${email}</a></p>` : ''}

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Acest mesaj a fost trimis prin formularul de pe website-ul ${businessName}.
        </p>
      </body>
      </html>
    `,
  });

  console.log(`Email notification sent for form: ${form.title} (${formType})`);

  // Send confirmation email to client
  if (email) {
    const confirmationMessages: Record<
      string,
      { subject: string; message: string }
    > = {
      contact: {
        subject: `Am primit mesajul tau - ${businessName}`,
        message:
          'Iti multumim pentru mesaj! Am primit cererea ta si vom raspunde in cel mai scurt timp posibil.',
      },
      feedback: {
        subject: `Multumim pentru feedback - ${businessName}`,
        message:
          'Apreciem feedbackul tau! Ne ajuta sa ne imbunatatim serviciile.',
      },
      other: {
        subject: `Confirmare - ${businessName}`,
        message: 'Am primit formularul tau si il vom procesa in curand.',
      },
    };

    const confirmation =
      confirmationMessages[formType] || confirmationMessages.other;

    await payload.sendEmail({
      to: email,
      subject: confirmation.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Buna ${name},</h2>

          <p>${confirmation.message}</p>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Ce urmeaza:</strong><br>
              Echipa noastra va analiza mesajul tau si te vom contacta in curand.
            </p>
          </div>

          <p>Cu respect,<br><strong>${businessName}</strong></p>

          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Acest email este o confirmare automata. Nu este nevoie sa raspunzi.
          </p>
        </body>
        </html>
      `,
    });

    console.log(`Confirmation email sent to client: ${email}`);
  }
};

// Handle booking submission - creates entry in Bookings collection
const handleBookingSubmission = async (
  doc: FormSubmissionData,
  payload: Payload,
): Promise<void> => {
  const { submissionData } = doc;

  const clientName = getDisplayName(submissionData);
  const clientEmail = getFieldValue(submissionData, 'email');
  const clientPhone =
    getFieldValue(submissionData, 'phone') ||
    getFieldValue(submissionData, 'telefon');
  const serviceName =
    getFieldValue(submissionData, 'service') ||
    getFieldValue(submissionData, 'serviciu');
  const date =
    getFieldValue(submissionData, 'date') ||
    getFieldValue(submissionData, 'data');
  const time =
    getFieldValue(submissionData, 'time') ||
    getFieldValue(submissionData, 'ora');
  const notes =
    getFieldValue(submissionData, 'notes') ||
    getFieldValue(submissionData, 'observatii');
  const teamMemberName =
    getFieldValue(submissionData, 'teamMember') ||
    getFieldValue(submissionData, 'specialist');

  if (!clientEmail || !date) {
    console.warn('Booking form missing required fields (email or date)');
    return;
  }

  // Try to find the service by title
  let serviceId: string | undefined;
  if (serviceName && serviceName !== 'none') {
    try {
      const services = await payload.find({
        collection: 'services',
        where: { title: { contains: serviceName } },
        limit: 1,
      });
      if (services.docs.length > 0) {
        serviceId = services.docs[0].id;
      }
    } catch {
      // Service not found, continue without linking
    }
  }

  // Try to find team member by name
  let teamMemberId: string | undefined;
  if (teamMemberName && teamMemberName !== 'none') {
    try {
      const members = await payload.find({
        collection: 'team',
        where: { name: { contains: teamMemberName } },
        limit: 1,
      });
      if (members.docs.length > 0) {
        teamMemberId = members.docs[0].id;
      }
    } catch {
      // Team member not found, continue without linking
    }
  }

  // Create the booking (this will trigger the Bookings collection hook for emails)
  await payload.create({
    collection: 'bookings',
    data: {
      clientName,
      clientEmail,
      clientPhone: clientPhone || undefined,
      service: serviceId,
      serviceName: serviceName || undefined,
      teamMember: teamMemberId,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      time: time || '10:00',
      notes,
      status: 'pending',
      source: 'website',
    },
    overrideAccess: true,
  });

  console.log(`Booking created for: ${clientName} on ${date} at ${time}`);
};

// Handle subscription order - creates entry in SubscriptionOrders collection
const handleOrderSubmission = async (
  doc: FormSubmissionData,
  payload: Payload,
): Promise<void> => {
  const { submissionData } = doc;

  const clientName = getDisplayName(submissionData);
  const clientEmail = getFieldValue(submissionData, 'email');
  const clientPhone =
    getFieldValue(submissionData, 'phone') ||
    getFieldValue(submissionData, 'telefon');
  const subscriptionName =
    getFieldValue(submissionData, 'subscription') ||
    getFieldValue(submissionData, 'abonament');
  const notes =
    getFieldValue(submissionData, 'notes') ||
    getFieldValue(submissionData, 'observatii');

  if (!clientEmail) {
    console.warn('Subscription order form missing required email');
    return;
  }

  // Try to find the subscription by title
  let subscriptionId: string | undefined;
  let subscriptionPrice: number | undefined;
  if (subscriptionName) {
    try {
      const subscriptions = await payload.find({
        collection: 'subscriptions',
        where: { title: { contains: subscriptionName } },
        limit: 1,
      });
      if (subscriptions.docs.length > 0) {
        subscriptionId = subscriptions.docs[0].id;
        subscriptionPrice = subscriptions.docs[0].pricing?.amount;
      }
    } catch {
      // Subscription not found, continue without linking
    }
  }

  // Create the subscription order (this will trigger the SubscriptionOrders collection hook for emails)
  await payload.create({
    collection: 'subscription-orders',
    data: {
      clientName,
      clientEmail,
      clientPhone: clientPhone || undefined,
      subscription: subscriptionId,
      subscriptionName: subscriptionName || 'Abonament',
      subscriptionPrice,
      notes,
      status: 'pending',
      source: 'website',
    },
    overrideAccess: true,
  });

  console.log(
    `Subscription order created for: ${clientName} - ${subscriptionName}`,
  );
};

// Handle newsletter subscription - adds to newsletter-subscribers collection
const handleNewsletterSubmission = async (
  doc: FormSubmissionData,
  payload: Payload,
): Promise<void> => {
  const { submissionData } = doc;
  const email = getFieldValue(submissionData, 'email');

  if (!email) {
    console.warn('Newsletter form submission without email');
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if already subscribed
  const existing = await payload.find({
    collection: 'newsletter-subscribers',
    where: { email: { equals: normalizedEmail } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    const subscriber = existing.docs[0];
    // Reactivate if previously unsubscribed
    if (subscriber.status === 'unsubscribed') {
      await payload.update({
        collection: 'newsletter-subscribers',
        id: subscriber.id,
        data: { status: 'active', source: 'website' },
        overrideAccess: true,
      });
      console.log(`Newsletter subscriber reactivated: ${normalizedEmail}`);
    }
    return;
  }

  // Create new subscriber (this will trigger the welcome email hook)
  await payload.create({
    collection: 'newsletter-subscribers',
    data: {
      email: normalizedEmail,
      status: 'active',
      source: 'website',
    },
    overrideAccess: true,
  });

  console.log(`Newsletter subscriber added: ${normalizedEmail}`);
};

/**
 * Main hook that processes form submissions
 * This is added to form-submissions collection via formSubmissionOverrides
 */
export const processFormSubmission: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only process new submissions
  if (operation !== 'create') return doc;

  try {
    // Populate the form relationship to get formType
    const submission = await req.payload.findByID({
      collection: 'form-submissions',
      id: doc.id,
      depth: 1, // Populate form relationship
      req,
    });

    const form = submission.form as FormSubmissionData['form'];
    const formType = (form?.formType || 'contact') as FormType;

    // Get business info for emails
    const businessInfo = await req.payload.findGlobal({
      slug: 'business-info',
      req,
    });

    // Prepare data structure
    const formData: FormSubmissionData = {
      form: {
        id: typeof form === 'object' ? form.id : String(form),
        title: typeof form === 'object' ? form.title : undefined,
        formType: typeof form === 'object' ? form.formType : undefined,
      },
      submissionData: doc.submissionData || [],
    };

    console.log(
      `Processing form submission - Type: ${formType}, Form: ${formData.form.title}`,
    );

    // Handle based on formType
    switch (formType) {
      case 'newsletter':
        // Newsletter: add to subscribers list (no email to business)
        await handleNewsletterSubmission(formData, req.payload);
        break;

      case 'booking':
        // Booking: create in Bookings collection (this triggers its own email hook)
        await handleBookingSubmission(formData, req.payload);
        break;

      case 'order':
        // Order: create in SubscriptionOrders collection (this triggers its own email hook)
        await handleOrderSubmission(formData, req.payload);
        break;

      default:
        // Contact, feedback, other: just send email notification
        await sendNotificationEmail(formData, req.payload, businessInfo);
    }
  } catch (error) {
    // Log but don't fail the submission
    console.error('Form submission processing error:', error);
  }

  return doc;
};
