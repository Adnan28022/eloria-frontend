const fs = require('fs');

// Fix products/page.tsx DollarSign
let p = fs.readFileSync('./src/app/admin/dashboard/products/page.tsx', 'utf8');
p = p.replace('Upload } from \"lucide-react\"', 'Upload, DollarSign } from \"lucide-react\"');
fs.writeFileSync('./src/app/admin/dashboard/products/page.tsx', p);

// Fix cart/page.tsx
let c = fs.readFileSync('./src/app/cart/page.tsx', 'utf8');
c = c.replace(/item\.product\._id \|\| item\.product\.id/g, '(item.product._id || item.product.id || \"\")');
c = c.replace(/removeFromCart\(item\.product\._id \|\| item\.product\.id\)/g, 'removeFromCart(item.product._id || item.product.id || \"\")');
fs.writeFileSync('./src/app/cart/page.tsx', c);

// Fix contact/page.tsx
let ct = fs.readFileSync('./src/app/contact/page.tsx', 'utf8');
ct = ct.replace('Instagram, ', '');
ct = ct.replace(/<Instagram/g, '<div');
fs.writeFileSync('./src/app/contact/page.tsx', ct);

