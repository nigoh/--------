import { describe, it, expect, beforeEach } from 'vitest';
import { useTeamStore } from '../features/teamManagement/stores/useTeamStore';

describe('useTeamStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useTeamStore.getState().reset();
  });

  it('adds a new team', () => {
    const { addTeam, teams } = useTeamStore.getState();
    
    addTeam({
      name: 'Test Team',
      description: 'A test team',
      members: ['Alice', 'Bob'],
      color: '#FF0000',
    });
    
    expect(useTeamStore.getState().teams.length).toBe(1);
    expect(useTeamStore.getState().teams[0].name).toBe('Test Team');
    expect(useTeamStore.getState().teams[0].members).toEqual(['Alice', 'Bob']);
    expect(useTeamStore.getState().teams[0].isActive).toBe(true);
  });

  it('updates a team', () => {
    const { addTeam, updateTeam } = useTeamStore.getState();
    
    // Add a team first
    addTeam({
      name: 'Original Team',
      description: 'Original description',
      members: ['Alice'],
      color: '#FF0000',
    });
    
    const teamId = useTeamStore.getState().teams[0].id;
    
    // Update the team
    updateTeam(teamId, {
      name: 'Updated Team',
      description: 'Updated description',
    });
    
    const updatedTeam = useTeamStore.getState().teams[0];
    expect(updatedTeam.name).toBe('Updated Team');
    expect(updatedTeam.description).toBe('Updated description');
    expect(updatedTeam.members).toEqual(['Alice']); // Should remain unchanged
  });

  it('deletes a team', () => {
    const { addTeam, deleteTeam } = useTeamStore.getState();
    
    // Add a team first
    addTeam({
      name: 'Team to Delete',
      description: 'This team will be deleted',
      members: ['Alice'],
      color: '#FF0000',
    });
    
    expect(useTeamStore.getState().teams.length).toBe(1);
    
    const teamId = useTeamStore.getState().teams[0].id;
    deleteTeam(teamId);
    
    expect(useTeamStore.getState().teams.length).toBe(0);
  });

  it('toggles team status', () => {
    const { addTeam, toggleTeamStatus } = useTeamStore.getState();
    
    // Add a team first
    addTeam({
      name: 'Status Toggle Team',
      description: 'Test status toggling',
      members: ['Alice'],
      color: '#FF0000',
    });
    
    const teamId = useTeamStore.getState().teams[0].id;
    expect(useTeamStore.getState().teams[0].isActive).toBe(true);
    
    // Toggle status
    toggleTeamStatus(teamId);
    expect(useTeamStore.getState().teams[0].isActive).toBe(false);
    
    // Toggle back
    toggleTeamStatus(teamId);
    expect(useTeamStore.getState().teams[0].isActive).toBe(true);
  });
});