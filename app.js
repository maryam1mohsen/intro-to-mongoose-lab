const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const prompt = require('prompt-sync')();
const Customer = require('./models/Customer');


console.log('Welcome to the CRM');

// menu Function
const menu = () => {
  console.log(`
  What would you like to do?
    1. Create a customer
    2. View all customers
    3. Update a customer
    4. Delete a customer
    5. Quit
  `);

  const choice = prompt('Number of action to run: ');
  return choice;
};

//running the app
const main = async () => {
  let running = true;

  while (running) {
    const choice = menu();
    switch (choice) {
      case '1':
        // creating a customer
        const name = prompt('Enter customer name: ');
        const age = prompt('Enter customer age: ');
        const newCustomer = new Customer({ name, age });
        await newCustomer.save();
        console.log('Customer created successfully!');
        break;
      case '2':
        // viewing customers
        const customers = await Customer.find();
        customers.forEach(customer => {
          console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
        });
        break;
      case '3':
        // updating Customer
        const updateId = prompt('Enter the id of the customer to update: ');
        const updatedName = prompt('Enter new name: ');
        const updatedAge = prompt('Enter new age: ');
        await Customer.findByIdAndUpdate(updateId, { name: updatedName, age: updatedAge });
        console.log('Customer updated successfully!');
        break;


      case '4':
        // deleting the customer
        const deleteId = prompt('Enter the id of the customer to delete: ');
        await Customer.findByIdAndDelete(deleteId);
        console.log('Customer deleted successfully!');
        break;


      case '5':
        // quit
        running = false;
        console.log('Exiting...');
        mongoose.connection.close();
        break;
      default:
        console.log('Invalid choice, please try again.');
    }
  }
};

main();
