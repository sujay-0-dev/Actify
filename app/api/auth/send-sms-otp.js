export async function sendSMSOTP(phone, otp) {
    console.log(`Sending OTP ${otp} to phone: ${phone}`);
    
    // In development mode, just return the OTP for easy testing
    if (DEVELOPMENT_MODE) {
      console.log('Development mode: Skipping actual SMS sending');
      return {
        success: true,
        message: "Development mode: OTP generated",
        otp: otp
      };
    }
    
    try {
      // Implement your SMS service integration here
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "SMS sent successfully"
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        message: `Failed to send SMS verification code: ${error.message}`
      };
    }
  }