# Fedena - School and College Management Software

## Overview

Fedena is a comprehensive, web-based school management system designed to streamline educational institution operations. This project provides a complete enterprise resource planning (ERP) solution for schools, colleges, and educational institutions with 100+ integrated modules covering everything from student management to financial operations.

### Website is live at: https://msb-io.github.io/Fedena/

### Premium Features
- **FedenAI** - AI-powered assistant for educational management
- **Mobile Applications** - Native iOS and Android apps
- **Cloud Integration** - Secure cloud-based deployment
- **Multi-School Support** - Centralized management for multiple institutions
- **Custom Integrations** - API access for third-party integrations
- **Advanced Security** - Enterprise-grade data protection

## Technology Stack

### Frontend
- **HTML5** - Modern semantic markup
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **JavaScript (ES6+)** - Modern JavaScript with modular architecture
- **Font Awesome** - Icon library for UI components

### Architecture
- **Responsive Design** - Mobile-first approach with cross-device compatibility
- **Component-Based** - Modular components for navbar, footer, and reusable elements

### External Services
- **EmailJS** - Contact form integration
- **Google Gemini AI** - AI assistant functionality
- **CDN Integration** - Optimized loading of external resources

### Key Components

#### Dynamic Navigation
The project uses a component-based architecture where navigation and footer are loaded dynamically:

```javascript
// loadComponents.js handles dynamic loading
fetch(`${basePath}navbar.html`)
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    window.initMobileMenu();
  });
```

#### Mobile Responsiveness
Fully responsive design with mobile-first approach:
- Collapsible navigation menu
- Touch-friendly interface
- Optimized layouts for all screen sizes

#### AI Assistant
Interactive AI chat interface powered by Google Gemini:
- Chat history management
- Real-time typing indicators
- Mobile-optimized interface

### Configuration

#### EmailJS Setup
Update contact form configuration in `contactForm.js`:
```javascript
const EMAILJS_CONFIG = {
  publicKey: "your-public-key",
  serviceId: "your-service-id",
  templateId: "your-template-id"
};
```

#### AI Assistant Setup
Configure Gemini AI in `FedenAI.js`:
```javascript
this.geminiApiKey = "your-gemini-api-key";
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
