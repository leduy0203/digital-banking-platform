package com.digitalbanking.service.impl;

import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "EMAIL-SERVICE")
public class EmailServiceImpl implements EmailService {

    @Value("${app.sendgrid.api-key}")
    private String apiKey;

    @Value("${app.sendgrid.from-email}")
    private String fromEmail;

    @Value("${app.sendgrid.template-id}")
    private String templateId;

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        log.info("Sending OTP email to {} with otp {}", toEmail, otpCode);

        Mail mail = getMail(toEmail, otpCode);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            log.info("SendGrid status code: {}", response.getStatusCode());

            if (response.getStatusCode() >= 400) {
                log.error("Failed to send OTP email. Response body: {}", response.getBody());
                throw new BusinessException(ErrorCode.EMAIL_SEND_FAILED);
            }
        } catch (IOException ex) {
            log.error("Error occurred while sending email via SendGrid", ex);
            throw new BusinessException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    private Mail getMail(String toEmail, String otpCode) {
        Email from = new Email(fromEmail, "Digital Banking");
        Email to = new Email(toEmail);

        // Create personalization and add dynamic template data
        Personalization personalization = new Personalization();
        personalization.addTo(to);
        personalization.addDynamicTemplateData("otp_code", otpCode);

        // Create the mail object and set the template ID
        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(templateId);
        mail.addPersonalization(personalization);
        return mail;
    }
}
