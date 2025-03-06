const QRCode = require('qrcode');

const generateQRCode = async (data) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(data);
        return qrCodeDataURL;
    } catch (err) {
        console.error(err);
        throw new Error('QR Code generation failed');
    }
};

module.exports = { default: generateQRCode };
