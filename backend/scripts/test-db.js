require('dotenv').config();
const { sequelize, User, VerificationToken } = require('../models');

async function testDatabase() {
  console.log('Starting database tests...');
  
  try {
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful!');
    
    // 2. Sync models (creates tables if they don't exist)
    console.log('\n2. Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('✓ Database models synced!');
    
    // 3. Test User model operations
    console.log('\n3. Testing User model operations...');
    
    // Create a test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('✓ Test user created:', testUser.toJSON());
    
    // Test password hashing
    const isPasswordValid = await testUser.isValidPassword('password123');
    console.log('✓ Password validation test:', isPasswordValid ? 'PASSED' : 'FAILED');
    
    // Test JWT token generation
    const token = testUser.generateAuthToken();
    console.log('✓ JWT token generated:', token ? 'PASSED' : 'FAILED');
    
    // 4. Test VerificationToken model operations
    console.log('\n4. Testing VerificationToken model operations...');
    
    // Create a verification token
    const verificationToken = await VerificationToken.create({
      userId: testUser.id,
      token: 'test-token-123',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });
    console.log('✓ Verification token created:', verificationToken.toJSON());
    
    // Test token lookup
    const foundToken = await VerificationToken.findOne({
      where: { token: 'test-token-123' },
      include: [{ model: User, as: 'user' }]
    });
    
    if (foundToken) {
      console.log('✓ Token lookup successful:', {
        token: foundToken.token,
        userEmail: foundToken.user.email,
        userId: foundToken.userId
      });
    } else {
      console.log('✗ Token lookup failed');
    }
    
    // 5. Test transaction
    console.log('\n5. Testing transactions...');
    const transaction = await sequelize.transaction();
    
    try {
      // Update user within transaction
      await testUser.update({ firstName: 'Updated' }, { transaction });
      
      // Create another token within the same transaction
      await VerificationToken.create({
        userId: testUser.id,
        token: 'test-token-456',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }, { transaction });
      
      // Commit the transaction
      await transaction.commit();
      console.log('✓ Transaction committed successfully');
      
      // Verify the update
      const updatedUser = await User.findByPk(testUser.id);
      console.log('✓ User updated in transaction:', updatedUser.firstName === 'Updated' ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      // If we get here, roll back the transaction
      await transaction.rollback();
      console.error('Transaction failed, rolled back:', error);
    }
    
    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the tests
testDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
