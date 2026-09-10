package com.digitalbanking.service.impl;

import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
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
        sendViaSendGrid(mail);
    }

    @Override
    public void sendKycApprovedEmail(String toEmail, String customerName) {
        log.info("Sending KYC Approved email to {}", toEmail);

        String subject = "[Digital Banking] Hồ sơ định danh eKYC đã được phê duyệt thành công";
        String htmlBody = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <h2 style="color: #10b981; margin-top: 0;"> Xin chúc mừng!</h2>
                <p>Kính gửi <strong>%s</strong>,</p>
                <p>Hồ sơ định danh trực tuyến (eKYC) của bạn đã được ngân hàng thẩm định và <strong style="color: #10b981;">PHÊ DUYỆT THÀNH CÔNG</strong>.</p>
                <p>Tất cả tính năng giao dịch chuyển khoản, mở tài khoản thanh toán và các dịch vụ thẻ hiện đã được kích hoạt đầy đủ.</p>
                <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
                    Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ bộ phận hỗ trợ 24/7 của chúng tôi.
                </div>
            </div>
            """.formatted(customerName != null ? customerName : "Quý khách");

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    @Override
    public void sendKycRejectedEmail(String toEmail, String customerName, String reason) {
        log.info("Sending KYC Rejected email to {} with reason: {}", toEmail, reason);

        String subject = "[Digital Banking] Thông báo kết quả thẩm định hồ sơ eKYC";
        String htmlBody = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <h2 style="color: #ef4444; margin-top: 0;"> Thông báo thẩm định hồ sơ eKYC</h2>
                <p>Kính gửi <strong>%s</strong>,</p>
                <p>Hồ sơ định danh eKYC của bạn chưa được phê duyệt do lý do sau:</p>
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 16px 0; color: #991b1b;">
                    <strong>Lý do từ chối:</strong> %s
                </div>
                <p>Vui lòng đăng nhập lại vào ứng dụng để thực hiện chụp lại giấy tờ tùy thân và chân dung theo đúng hướng dẫn.</p>
                <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
                    Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận CSKH để được trợ giúp.
                </div>
            </div>
            """.formatted(customerName != null ? customerName : "Quý khách", reason);

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        Email from = new Email(fromEmail, "Digital Banking");
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, subject, to, content);

        try {
            sendViaSendGrid(mail);
        } catch (Exception ex) {
            log.error("Failed to send notification email to {}", toEmail, ex);
        }
    }

    private void sendViaSendGrid(Mail mail) {
        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            log.info("SendGrid status code: {}", response.getStatusCode());

            if (response.getStatusCode() >= 400) {
                log.error("Failed to send email via SendGrid. Response body: {}", response.getBody());
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

        Personalization personalization = new Personalization();
        personalization.addTo(to);
        personalization.addDynamicTemplateData("otp_code", otpCode);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(templateId);
        mail.addPersonalization(personalization);
        return mail;
    }
}