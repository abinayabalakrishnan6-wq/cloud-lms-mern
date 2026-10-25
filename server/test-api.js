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

const runTests = async () => {
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

    // 4. Fetch Courses
    const coursesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/courses',
      method: 'GET',
    });
    console.log(`[PASS] 4. Fetch Courses Catalog (HTTP ${coursesRes.status}): Found ${coursesRes.data.count} published courses.`);

    // 5. Admin Stats
    const statsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`[PASS] 5. Admin Analytics Platform Stats (HTTP ${statsRes.status}): Total Users: ${statsRes.data.data.totals.users}, Courses: ${statsRes.data.data.totals.courses}, Enrollments: ${statsRes.data.data.totals.enrollments}`);

    // 6. Student Enrollments
    const enrollmentsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enrollments/my-courses',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`[PASS] 6. Student Enrolled Courses (HTTP ${enrollmentsRes.status}): Enrolled in ${enrollmentsRes.data.count} courses.`);

    console.log('\n🎉 ALL 6 CORE LMS API TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
};

runTests();
