# Fix Plan: Teacher's "My Courses" Page

## Issue
The "My Courses" page currently displays enrolled courses for all users. For teachers, it should display the courses they have created.

## Solution

### Backend

1.  **Add Controller Method**:
    *   File: `backend/controllers/courseController.js`
    *   Function: `getCreatedCourses`
    *   Logic: Find all courses where `teacher_id` equals the current user's ID. Return all courses regardless of status (DRAFT, PUBLISHED).

2.  **Add Route**:
    *   File: `backend/routes/courseRoutes.js`
    *   Route: `GET /created`
    *   Middleware: `verifyToken`
    *   Handler: `courseController.getCreatedCourses`

### Frontend

1.  **Update Course Store**:
    *   File: `frontend/src/stores/course.js`
    *   Action: `fetchCreatedCourses`
    *   Logic: Call `GET /api/courses/created` and update state (maybe reuse `enrolledCourses` state or add a new `createdCourses` state).

2.  **Update MyCoursesView**:
    *   File: `frontend/src/views/course/MyCoursesView.vue`
    *   Logic:
        *   Import `useAuthStore`.
        *   In `onMounted`, check `authStore.user.role`.
        *   If `TEACHER`, call `fetchCreatedCourses`.
        *   If `STUDENT`, call `fetchEnrolledCourses`.
        *   Update the `courses` computed property to handle both data structures.
            *   Enrolled courses come as Enrollment objects containing a `course` property.
            *   Created courses come as Course objects directly.

## Implementation Steps

1.  Implement backend changes.
2.  Implement frontend store changes.
3.  Implement frontend view changes.
