<?php
// Simple mail handler for contact form
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Basic sanitization
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'Website Contact Form';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

if (!$email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

$to = 'info@hmwelfaretrust.com';
$fullMessage = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message\n";

$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try PHP mail(); if it fails, return error. For reliable delivery use SMTP/PHPMailer.
$sent = mail($to, $subject, $fullMessage, $headers);
if ($sent) {
    echo json_encode(['status' => 'ok']);
    exit;
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Mail failed']);
    exit;
}
