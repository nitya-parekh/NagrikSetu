const API_BASE = 'http://localhost:4000';

/**
 * Fetches all issues from the backend SQLite database.
 */
export async function fetchIssuesApi() {
  try {
    const response = await fetch(`${API_BASE}/issues`);
    if (!response.ok) {
      throw new Error(`Failed to fetch issues: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchIssuesApi:', error);
    return [];
  }
}

/**
 * Stages a new issue in the backend SQLite database.
 */
export async function createIssueApi(issueData) {
  try {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create issue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createIssueApi:', error);
    throw error;
  }
}

/**
 * Updates an issue's grievance_id and marks status as 'Officially Tracked' in the SQLite database.
 */
export async function updateGrievanceIdApi(id, grievanceId) {
  try {
    const cleanId = String(id).replace(/^CMP-/, '');
    const response = await fetch(`${API_BASE}/issues/${cleanId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grievance_id: grievanceId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update grievance ID: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateGrievanceIdApi:', error);
    throw error;
  }
}
