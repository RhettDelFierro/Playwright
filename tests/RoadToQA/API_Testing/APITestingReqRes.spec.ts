const { test, expect } = require('@playwright/test');

test('GET list of users', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?page=2');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('List of users:', data);

    // Assertions to verify the response data
    expect(data.page).toBe(2);
    expect(Array.isArray(data.data)).toBe(true);
});

test('GET single user', async ({ request }) => {
    const userId = 2;
    const response = await request.get(`https://reqres.in/api/users/${userId}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(`User with ID ${userId}:`, data);

    // Assertions to verify the response data
    expect(data.data.id).toBe(userId);
});

test('GET single user not found', async ({ request }) => {
    const userId = 23;
    const response = await request.get(`https://reqres.in/api/users/${userId}`);
    expect(response.status()).toBe(404);

    console.log(`User with ID ${userId} not found`);
});

test('GET list of resources', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/unknown');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('List of resources:', data);

    // Assertions to verify the response data
    expect(Array.isArray(data.data)).toBe(true);
});

test('GET single resource', async ({ request }) => {
    const resourceId = 2;
    const response = await request.get(`https://reqres.in/api/unknown/${resourceId}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(`Resource with ID ${resourceId}:`, data);

    // Assertions to verify the response data
    expect(data.data.id).toBe(resourceId);
});

test('GET single resource not found', async ({ request }) => {
    const resourceId = 23;
    const response = await request.get(`https://reqres.in/api/unknown/${resourceId}`);
    expect(response.status()).toBe(404);

    console.log(`Resource with ID ${resourceId} not found`);
});

test('POST create user', async ({ request }) => {
    const newUser = {
        name: 'morpheus',
        job: 'leader'
    };

    const response = await request.post('https://reqres.in/api/users', {
        data: newUser
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const createdUser = await response.json();
    console.log('Created User:', createdUser);

    // Assertions to verify the created user details
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.job).toBe(newUser.job);
});

test('PUT update user', async ({ request }) => {
    const userId = 2;
    const updatedUser = {
        name: 'morpheus',
        job: 'zion resident'
    };

    const response = await request.put(`https://reqres.in/api/users/${userId}`, {
        data: updatedUser
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const updatedData = await response.json();
    console.log('Updated User:', updatedData);

    // Assertions to verify the updated user details
    expect(updatedData.name).toBe(updatedUser.name);
    expect(updatedData.job).toBe(updatedUser.job);
});

test('PATCH update user', async ({ request }) => {
    const userId = 2;
    const updatedUser = {
        name: 'morpheus',
        job: 'zion resident'
    };

    const response = await request.patch(`https://reqres.in/api/users/${userId}`, {
        data: updatedUser
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const updatedData = await response.json();
    console.log('Updated User (PATCH):', updatedData);

    // Assertions to verify the updated user details
    expect(updatedData.name).toBe(updatedUser.name);
    expect(updatedData.job).toBe(updatedUser.job);
});

test('DELETE user', async ({ request }) => {
    const userId = 2;

    const response = await request.delete(`https://reqres.in/api/users/${userId}`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);

    console.log(`Deleted User ID: ${userId}`);

    // No follow-up verification needed as the expected status is 204 No Content
});

test('POST register user - successful', async ({ request }) => {
    const user = {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
    };

    const response = await request.post('https://reqres.in/api/register', {
        data: user
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('Registered User:', data);

    // Assertions to verify the registration details
    expect(data.id).toBeTruthy();
    expect(data.token).toBeTruthy();
});

test('POST register user - unsuccessful', async ({ request }) => {
    const user = {
        email: 'sydney@fife'
    };

    const response = await request.post('https://reqres.in/api/register', {
        data: user
    });
    expect(response.status()).toBe(400);

    const data = await response.json();
    console.log('Failed Registration:', data);

    // Assertions to verify the failure message
    expect(data.error).toBe('Missing password');
});

test('POST login user - successful', async ({ request }) => {
    const user = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
    };

    const response = await request.post('https://reqres.in/api/login', {
        data: user
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('Logged In User:', data);

    // Assertions to verify the login details
    expect(data.token).toBeTruthy();
});

test('POST login user - unsuccessful', async ({ request }) => {
    const user = {
        email: 'peter@klaven'
    };

    const response = await request.post('https://reqres.in/api/login', {
        data: user
    });
    expect(response.status()).toBe(400);

    const data = await response.json();
    console.log('Failed Login:', data);

    // Assertions to verify the failure message
    expect(data.error).toBe('Missing password');
});

test('GET delayed response', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?delay=3');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('Delayed Response:', data);

    // Assertions to verify the response data
    expect(Array.isArray(data.data)).toBe(true);
});
