const bookingConfirmationTemplate = (booking) => {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #7A9122;">Booking Confirmed!</h1>
            <p>Thank you for choosing Brentharen Innovations.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p>Hello <strong>${booking.firstName}</strong>,</p>
            <p>Your reservation has been successfully confirmed. We are excited to host you!</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Reservation Details</h3>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Room Type:</strong> ${booking.roomType}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <p>If you have any special requests or need to modify your booking, please contact us or visit your dashboard.</p>
        </div>

        <div style="text-align: center; font-size: 0.85rem; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} Brentharen Innovations. All rights reserved.</p>
        </div>
    </div>
    `;
};

const cancellationTemplate = (booking) => {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #e53935;">Booking Cancelled</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p>Hello <strong>${booking.firstName}</strong>,</p>
            <p>Your reservation #${booking.id} has been cancelled as requested.</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Cancelled Reservation Details</h3>
            <p><strong>Room Type:</strong> ${booking.roomType}</p>
            <p><strong>Dates:</strong> ${booking.checkIn} to ${booking.checkOut}</p>
        </div>

        <div style="text-align: center; font-size: 0.85rem; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} Brentharen Innovations. All rights reserved.</p>
        </div>
    </div>
    `;
};

const passwordResetTemplate = (resetLink) => {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #7A9122;">Password Reset Request</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #7A9122; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        </div>

        <div style="text-align: center; font-size: 0.85rem; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} Brentharen Innovations. All rights reserved.</p>
        </div>
    </div>
    `;
};

module.exports = { bookingConfirmationTemplate, cancellationTemplate, passwordResetTemplate };
