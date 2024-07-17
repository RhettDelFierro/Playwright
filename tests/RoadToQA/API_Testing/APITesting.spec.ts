const { test, expect } = require('@playwright/test');

test('Get and print all contacts', async ({ request }) => {
    const response = await request.get('http://phone-api.testamplify.io/contacts');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('All Contacts:', data.contacts);

    // Optionally, you can add more assertions to verify the response data
    expect(Array.isArray(data.contacts)).toBe(true);
    expect(data.contacts.length).toBeGreaterThan(0);
});

test('Get and print specific contact by ID', async ({ request }) => {
    const contactId = 116;
    const response = await request.get(`http://phone-api.testamplify.io/contacts/${contactId}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(`Contact with ID ${contactId}:`, data.contact);

    // Assertions to verify the specific contact details
    expect(data.contact).toEqual({
        id: 116,
        name: 'Michael Jordan',
        email: 'Hooper23@example.com'
    });
});

test('Create a new contact and verify', async ({ request }) => {
    const newContact = {
        name: 'New Contact',
        email: 'newcontact@example.com'
    };

    const response = await request.post('http://phone-api.testamplify.io/contacts', {
        data: newContact
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const createdContact = await response.json();
    console.log('Created Contact:', createdContact.contact);

    // Assertions to verify the created contact details
    expect(createdContact.contact).toEqual({
        id: expect.any(Number),
        name: 'New Contact',
        email: 'newcontact@example.com'
    });
});

test('Get and print all messages', async ({ request }) => {
    const response = await request.get('http://phone-api.testamplify.io/messages');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('All Messages:', data.messages);

    // Optionally, you can add more assertions to verify the response data
    expect(Array.isArray(data.messages)).toBe(true);
    expect(data.messages.length).toBeGreaterThan(0);
});

test('Get and print specific message by ID', async ({ request }) => {
    const messageId = 'd180cd2d-822b-439d-a6af-77844fc8fcf4';
    const response = await request.get(`http://phone-api.testamplify.io/messages/${messageId}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(`Message with ID ${messageId}:`, data.message);

    // Assertions to verify the specific message details
    expect(data.message).toEqual({
        id: messageId,
        sender: 'Olivia Thompson',
        recipient: 'Robert Wilson',
        message: 'Hello'
    });
});

test('Update a message and verify', async ({ request }) => {
    const messageId = 'd180cd2d-822b-439d-a6af-77844fc8fcf4';
    const updatedMessage = {
        message: 'Updated message content.'
    };

    const response = await request.put(`http://phone-api.testamplify.io/messages/${messageId}`, {
        data: updatedMessage
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const updatedData = await response.json();
    console.log('Updated Message:', updatedData.message);

    // Assertions to verify the updated message details
    expect(updatedData.message).toEqual({
        id: messageId,
        sender: 'Olivia Thompson',
        recipient: 'Robert Wilson',
        message: 'Updated message content.'
    });
});

test('Delete a message and verify', async ({ request }) => {
    const messageId = 'd180cd2d-822b-439d-a6af-77844fc8fcf4';

    const response = await request.delete(`http://phone-api.testamplify.io/messages/${messageId}`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);

    console.log(`Deleted Message ID: ${messageId}`);

    // Optionally, you can add a follow-up request to verify the message was deleted
    const followUpResponse = await request.get(`http://phone-api.testamplify.io/messages/${messageId}`);
    expect(followUpResponse.status()).toBe(404);
});

test('Get and print all favorites', async ({ request }) => {
    const response = await request.get('http://phone-api.testamplify.io/favorites');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('All Favorites:', data);

    // Optionally, you can add more assertions to verify the response data
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
});

test('Get and print specific favorite by ID', async ({ request }) => {
    const favoriteId = 1;
    const response = await request.get(`http://phone-api.testamplify.io/favorites/${favoriteId}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(`Favorite with ID ${favoriteId}:`, data);

    // Assertions to verify the specific favorite details
    expect(data).toEqual({
        contactId: 1,
        name: 'updated Fav Name'
    });
});

test('Create a new favorite and verify', async ({ request }) => {
    const newFavorite = {
        name: 'New Favorite',
        contactId: '3'
    };

    const response = await request.post('http://phone-api.testamplify.io/favorites', {
        data: newFavorite
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const createdFavorite = await response.json();
    console.log('Created Favorite:', createdFavorite);

    // Assertions to verify the created favorite details
    expect(createdFavorite).toEqual({
        id: expect.any(Number),
        name: 'New Favorite',
        contactId: '3'
    });
});

test('Update a favorite and verify', async ({ request }) => {
    const favoriteId = 1;
    const updatedFavorite = {
        name: 'Updated Favorite Name'
    };

    const response = await request.patch(`http://phone-api.testamplify.io/favorites/${favoriteId}`, {
        data: updatedFavorite
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const updatedData = await response.json();
    console.log('Updated Favorite:', updatedData);

    // Assertions to verify the updated favorite details
    expect(updatedData).toEqual({
        contactId: 1,
        name: 'Updated Favorite Name'
    });
});

test('Delete a favorite and verify', async ({ request }) => {
    const favoriteId = 1;

    const response = await request.delete(`http://phone-api.testamplify.io/favorites/${favoriteId}`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);

    console.log(`Deleted Favorite ID: ${favoriteId}`);

    // Optionally, you can add a follow-up request to verify the favorite was deleted
    const followUpResponse = await request.get(`http://phone-api.testamplify.io/favorites/${favoriteId}`);
    expect(followUpResponse.status()).toBe(404);
});