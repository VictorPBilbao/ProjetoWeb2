package com.ufpr.byteassist_backend.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import com.ufpr.byteassist_backend.dto.DetailedUserDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String welcomeEmailTemplate;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
        this.welcomeEmailTemplate = loadWelcomeEmailTemplate();
    }

    private String loadWelcomeEmailTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/welcome-email.html");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load welcome email template", e);
        }
    }

    public void sendEmail(DetailedUserDTO user, String username) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("ByteAssist Bot <byteassist.bot@gmail.com>");
            helper.setTo(user.getEmail());
            helper.setSubject("Bem-vindo ao ByteAssist - Sua conta foi criada!");

            String htmlContent = prepareWelcomeEmail(user, username);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            System.out.println("Welcome email sent successfully to: " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("Failed to send welcome email to: " + user.getEmail());
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    private String prepareWelcomeEmail(DetailedUserDTO user, String username) {
        String loginUrl = "http://localhost:4200/login"; // Change this to your actual frontend URL

        return welcomeEmailTemplate
                .replace("{{NOME}}", user.getPerson().getName().getFirst())
                .replace("{{USERNAME}}", username)
                .replace("{{EMAIL}}", user.getEmail())
                .replace("{{PASSWORD}}", user.getPassword())
                .replace("{{LOGIN_URL}}", loginUrl);
    }
}
