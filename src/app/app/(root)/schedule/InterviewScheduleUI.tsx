import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

function MentorSessionScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const sessions = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createSession = useMutation(api.interviews.createInterview);

  const mentees = users?.filter((u) => u.role === "candidate");
  const mentors = users?.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    menteeId: "",
    mentorIds: user?.id ? [user.id] : [],
  });

  const scheduleSession = async () => {
    if (!client || !user) return;
    if (!formData.menteeId || formData.mentorIds.length === 0) {
      toast.error("Please select both mentee and at least one mentor");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, menteeId, mentorIds } = formData;
      const [hours, minutes] = time.split(":");
      const sessionDate = new Date(date);
      sessionDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: sessionDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createSession({
        title,
        description,
        startTime: sessionDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId: menteeId,
        interviewerIds: mentorIds,
      });

      setOpen(false);
      toast.success("Mentoring session scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        menteeId: "",
        mentorIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addMentor = (mentorId: string) => {
    if (!formData.mentorIds.includes(mentorId)) {
      setFormData((prev) => ({
        ...prev,
        mentorIds: [...prev.mentorIds, mentorId],
      }));
    }
  };

  const removeMentor = (mentorId: string) => {
    if (mentorId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      mentorIds: prev.mentorIds.filter((id) => id !== mentorId),
    }));
  };

  const selectedMentors = mentors.filter((i) =>
    formData.mentorIds.includes(i.clerkId)
  );

  const availableMentors = mentors.filter(
    (i) => !formData.mentorIds.includes(i.clerkId)
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* HEADER INFO */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Saarthi Mentor Meet
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage mentoring sessions</p>
        </div>

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
              Schedule Session
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Schedule Mentoring Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* SESSION TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  placeholder="Session title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* SESSION DESC */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  placeholder="Session description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* MENTEE */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mentee</label>
                <Select
                  value={formData.menteeId}
                  onValueChange={(menteeId) => setFormData({ ...formData, menteeId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mentee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentees.map((mentee) => (
                      <SelectItem key={mentee.clerkId} value={mentee.clerkId}>
                        <UserInfo user={mentee} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MENTORS */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mentors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMentors.map((mentor) => (
                    <div
                      key={mentor.clerkId}
                      className="inline-flex items-center gap-2 bg-blue-100 px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={mentor} />
                      {mentor.clerkId !== user?.id && (
                        <button
                          onClick={() => removeMentor(mentor.clerkId)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableMentors.length > 0 && (
                  <Select onValueChange={addMentor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMentors.map((mentor) => (
                        <SelectItem key={mentor.clerkId} value={mentor.clerkId}>
                          <UserInfo user={mentor} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* DATE & TIME */}
              <div className="flex gap-4">
                {/* CALENDAR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* TIME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={scheduleSession} 
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Session"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LOADING STATE & SESSION CARDS */}
      {!sessions ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-blue-600" />
        </div>
      ) : sessions.length > 0 ? (
        <div className="spacey-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <MeetingCard key={session._id} interview={session} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">No mentoring sessions scheduled</div>
      )}
    </div>
  );
}

export default MentorSessionScheduleUI;