const BASE_URL = 'http://localhost:5000/api';
const AUTH_BASE = `${BASE_URL}/auth`;
const ADMIN_BASE = `${BASE_URL}/admin`;
const USER_BASE = `${BASE_URL}/user`;

export const LOGIN_URL = `${AUTH_BASE}/login`;
export const FORGOT_PASSWORD_URL = `${AUTH_BASE}/forgot-password`;
export const RESET_PASSWORD_URL = `${AUTH_BASE}/forgot-password/verify`;

export const GET_DEPARTMENTS_URL = `${USER_BASE}/department/all`;
export const GET_DEPARTMENT_URL_PREFIX = `${USER_BASE}/department`;

export const REGISTER_OFFICIAL_URL = `${ADMIN_BASE}/official/create`;
export const ALL_OFFICIALS_URL = `${ADMIN_BASE}/official/all`;

export const NEW_COURSE_URL = `${ADMIN_BASE}/course/create`;
export const ALL_COURSES_URL = `${ADMIN_BASE}/course/all`;
export const EDIT_COURSE_URL = `${ADMIN_BASE}/course/update`;
export const GET_COURSE_URL_PREFIX = `${ADMIN_BASE}/course`;

export const NEW_FACULTY_TO_COURSE_URL = `${ADMIN_BASE}/assign/professor`;
export const EDIT_FACULTY_TO_COURSE_URL = `${ADMIN_BASE}/assign/professor/update`;

export const NEW_DEPARTMENT_URL = `${ADMIN_BASE}/department/create`;
export const EDIT_DEPARTMENT_URL = `${ADMIN_BASE}/department/update`;

export const NEW_STUDENT_URL = `${ADMIN_BASE}/student/create`;

export const GET_CLASS_ALL_URL = `${ADMIN_BASE}/classroom/get`;
export const NEW_CLASS_URL = `${ADMIN_BASE}/classroom/create`;
export const EDIT_CLASS_URL = `${ADMIN_BASE}/classroom/update`;

export const NEW_QUIZ_URL = `${ADMIN_BASE}/quiz/create`;
export const GET_QUIZ_URL = `${ADMIN_BASE}/quiz/get`;
export const GET_SUBMISSIONS_URL = `${ADMIN_BASE}/quiz/submissions`;


export const STUDENT_CAN_REGISTER_URL = `${USER_BASE}/courses-i-can-register`;
export const STUDENT_COURSES_URL = `${USER_BASE}/course/my`;
export const STUDENT_REGISTER_COURSE_URL = `${USER_BASE}/course/register`;
export const STUDENT_GET_CLASS = `${USER_BASE}/class/get`;

export const STUDENT_GET_QUIZ_URL = `${USER_BASE}/quiz/get`;
export const STUDENT_SUBMIT_QUIZ_URL = `${USER_BASE}/quiz/submit`;
