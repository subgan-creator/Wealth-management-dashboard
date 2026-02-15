'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTeams, mockUsers, mockBusinessEvents } from '@/lib/mock-data';
import type { Team, User } from '@/lib/types';

export default function TeamsConfig() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessEventIds: [] as string[],
  });

  const handleAddTeam = () => {
    setFormData({ name: '', description: '', businessEventIds: [] });
    setIsAddingTeam(true);
  };

  const handleEditTeam = (team: Team) => {
    setFormData({
      name: team.name,
      description: team.description,
      businessEventIds: team.businessEventIds || [],
    });
    setEditingTeam(team);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter((t) => t.id !== teamId));
    }
  };

  const handleSaveTeam = () => {
    if (!formData.name.trim()) return;

    if (editingTeam) {
      setTeams(
        teams.map((t) =>
          t.id === editingTeam.id
            ? { ...t, name: formData.name, description: formData.description, businessEventIds: formData.businessEventIds }
            : t
        )
      );
      setEditingTeam(null);
    } else {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        businessEventIds: formData.businessEventIds,
      };
      setTeams([...teams, newTeam]);
      setIsAddingTeam(false);
    }
    setFormData({ name: '', description: '', businessEventIds: [] });
  };

  const handleToggleBusinessEvent = (eventId: string) => {
    setFormData({
      ...formData,
      businessEventIds: formData.businessEventIds.includes(eventId)
        ? formData.businessEventIds.filter((id) => id !== eventId)
        : [...formData.businessEventIds, eventId],
    });
  };

  const handleUpdateUserTeam = (userId: string, newTeamId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, teamId: newTeamId } : u)));
  };

  const handleCloseDialog = () => {
    setIsAddingTeam(false);
    setEditingTeam(null);
    setFormData({ name: '', description: '', businessEventIds: [] });
  };

  const getTeamMembers = (teamId: string) => {
    return users.filter((u) => u.teamId === teamId);
  };

  const getBusinessEventName = (eventId: string) => {
    return mockBusinessEvents.find((e) => e.id === eventId)?.name || eventId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage teams, assign members, and configure business event access.
          </p>
        </div>
        <Button onClick={handleAddTeam} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team) => {
          const members = getTeamMembers(team.id);

          return (
            <Card key={team.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTeam(team.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Business Events */}
              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">Business Events</div>
                <div className="flex flex-wrap gap-1.5">
                  {team.businessEventIds && team.businessEventIds.length > 0 ? (
                    team.businessEventIds.map((eventId) => (
                      <Badge key={eventId} variant="secondary" className="text-xs">
                        {getBusinessEventName(eventId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No events assigned</span>
                  )}
                </div>
              </div>

              {/* Members */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Team Members ({members.length})
                </div>
                <div className="space-y-2">
                  {members.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No members assigned</div>
                  ) : (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                        <Select
                          value={member.teamId}
                          onValueChange={(value) => handleUpdateUserTeam(member.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {teams.length === 0 && (
          <Card className="col-span-2 p-12 text-center">
            <p className="text-muted-foreground">No teams configured yet.</p>
            <Button onClick={handleAddTeam} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Team
            </Button>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddingTeam || !!editingTeam} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
            <DialogDescription>
              Configure team details and assign business events they will handle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Account Services Team"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-description">Description</Label>
              <Input
                id="team-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of team responsibilities"
              />
            </div>

            <div className="space-y-2">
              <Label>Business Events</Label>
              <div className="border border-border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
                {mockBusinessEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2">
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={formData.businessEventIds.includes(event.id)}
                      onCheckedChange={() => handleToggleBusinessEvent(event.id)}
                    />
                    <label
                      htmlFor={`event-${event.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div className="font-medium">{event.name}</div>
                      <div className="text-xs text-muted-foreground">{event.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeam}>{editingTeam ? 'Save Changes' : 'Add Team'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
