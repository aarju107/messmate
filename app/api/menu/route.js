export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Get form data
    const { breakfast, lunch, snacks, dinner, date } = await request.json();
    console.log('📝 Received menu data for:', date);

    // Validation
    if (!breakfast || !lunch || !snacks || !dinner || !date) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Parse date
    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);

    // Check if menu already exists for this date
    const existingMenu = await Menu.findOne({
      date: {
        $gte: menuDate,
        $lt: new Date(menuDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingMenu) {
      console.log('⚠️ Menu already exists for this date');
      return new Response(
        JSON.stringify({ error: 'Menu already exists for this date' }),
        { status: 400 }
      );
    }

    // Create menu
    // For now, we'll use a placeholder userId (in real app, get from cookie)
    const newMenu = await Menu.create({
      breakfast,
      lunch,
      snacks,
      dinner,
      date: menuDate,
      createdBy: '000000000000000000000000', // Placeholder - update later with real user
    });

    console.log('✅ Menu created:', newMenu._id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Menu added successfully',
        menuId: newMenu._id,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}