const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database connection...');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    console.log('\nDatabase tables:');
    console.table(tables);
    
    // Check Blog table structure
    if (tables.some(t => t.table_name === 'blogs')) {
      console.log('\nBlog table structure:');
      const blogColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'blogs';
      `;
      console.table(blogColumns);
      
      // Count blogs
      const blogCount = await prisma.blog.count();
      console.log(`\nNumber of blogs in database: ${blogCount}`);
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
