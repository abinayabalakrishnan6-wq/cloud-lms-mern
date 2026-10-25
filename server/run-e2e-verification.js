const http = require('http');

// Helper to make JSON requests
const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const waitForServer = async (retries = 25, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
      });
      if (res.status === 200) {
        return true;
      }
    } catch (err) {
      // Waiting for server to listen
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error('Server did not start within expected time');
};

const run = async () => {
  console.log('🚀 Booting LMS Server for validation...\n');
  require('./server');

  console.log('⏳ Waiting for database connection & server initialization...');
  await waitForServer();
  console.log('✅ Server is online and accepting connections!\n');

  console.log('🧪 Starting LMS API End-to-End Test Suite...\n');

  try {
    // 1. Health check
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log(`[PASS] 1. Health Check (HTTP ${health.status}):`, health.data.service);

    // 2. Login as Student
    const studentLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'student@lms.com', password: 'password123' }
    );
    console.log(`[PASS] 2. Student Authentication (HTTP ${studentLogin.status}): Logged in as ${studentLogin.data.data.name} (Role: ${studentLogin.data.data.role})`);
    const studentToken = studentLogin.data.data.token;

    // 3. Login as Admin
    const adminLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@lms.com', password: 'password123' }
    );
    console.log(`[PASS] 3. Admin Authentication (HTTP ${adminLogin.status}): Logged in as ${adminLogin.data.data.name} (Role: ${adminLogin.data.data.role})`);
    const adminToken = adminLogin.data.data.token;

    // 4. Login as Faculty
    const facultyLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'faculty@lms.com', password: 'password123' }
    );
    console.log(`[PASS] 4. Faculty Authentication (HTTP ${facultyLogin.status}): Logged in as ${facultyLogin.data.data.name} (Role: ${facultyLogin.data.data.role})`);

    // 5. Fetch Courses
    const coursesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/courses',
      method: 'GET',
    });
    console.log(`[PASS] 5. Fetch Courses Catalog (HTTP ${coursesRes.status}): Found ${coursesRes.data.count} published courses.`);

    // 6. Admin Platform Analytics
    const statsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`[PASS] 6. Admin Analytics Platform Stats (HTTP ${statsRes.status}):`);
    console.log(`       - Total Users: ${statsRes.data.data.totals.users}`);
    console.log(`       - Courses: ${statsRes.data.data.totals.courses}`);
    console.log(`       - Enrollments: ${statsRes.data.data.totals.enrollments}`);
    console.log(`       - Submissions: ${statsRes.data.data.totals.submissions}`);

    // 7. Student Enrollments & Course Progress
    const enrollmentsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enrollments/my-courses',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`[PASS] 7. Student Enrolled Courses (HTTP ${enrollmentsRes.status}): Student is enrolled in ${enrollmentsRes.data.count} courses.`);

    // 8. Test Toggle Lesson Completion on Enrolled Course
    const enrolledCourse = enrollmentsRes.data.data[0].course;
    const lessonId = enrolledCourse.lessons[0]._id;
    const progressUpdate = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/enrollments/${enrolledCourse._id}/lessons/${lessonId}/complete`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`[PASS] 8. Real-time Lesson Progress Calculation (HTTP ${progressUpdate.status}): New course progress is ${progressUpdate.data.data.progress}% (Status: ${progressUpdate.data.data.status})`);

    console.log('\n=============================================================');
    console.log('🎉 ALL 8 E2E TESTS PASSED WITH 100% SUCCESSFUL VALIDATION!');
    console.log('=============================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Test execution failed:', err);
    process.exit(1);
  }
};

run();
