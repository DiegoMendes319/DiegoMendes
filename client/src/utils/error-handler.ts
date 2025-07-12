// Error handler to detect server failures vs maintenance mode
export function handleServerError(error: any) {
  // Check if it's a network error (server completely down)
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    // Server is completely unreachable
    window.location.href = '/server-error';
    return;
  }
  
  // Check if it's a 500+ error (server failure)
  if (error.status >= 500) {
    // Server error but still responding
    window.location.href = '/server-error';
    return;
  }
  
  // Check if it's a maintenance mode response
  if (error.status === 503 || (error.message && error.message.includes('maintenance'))) {
    // Maintenance mode - redirect to maintenance page
    window.location.href = '/maintenance';
    return;
  }
  
  // Other errors - handle normally
  return error;
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's a network error
  if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
    event.preventDefault();
    window.location.href = '/server-error';
  }
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Check if it's a network-related error
  if (event.error && event.error.message && event.error.message.includes('fetch')) {
    event.preventDefault();
    window.location.href = '/server-error';
  }
});