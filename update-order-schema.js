const fs = require('fs');

let orderSchema = fs.readFileSync('Backend_Zwigato/model/order.js', 'utf8');

const fieldsToAdd = `
    subtotal: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
      default: "COD",
    },
    transactionId: {
      type: String,
    },
`;

orderSchema = orderSchema.replace('    totalAmount: {', fieldsToAdd + '\n    totalAmount: {');

fs.writeFileSync('Backend_Zwigato/model/order.js', orderSchema);
console.log('Order Schema Updated');
