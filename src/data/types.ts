export interface Activity {
  id: string;
  technique: string;
  description: string;
  kind: string;
  modality: string;
  duration: number;
  default_duration: number;
  default_staff: string | null;
  default_location: string | null;
  default_time: string | null;
  category: string;
  tags: string[];
  color: string;
  overlap_allowed: boolean;
  characteristics: string[];
  cluster: Cluster["id"] | null;
}

export interface Appointment {
  id: string;
  pat_id: string;
  scheduled_time: string;
  duration: number;
  apt_status: AppointmentStatus;
  technique: Activity["technique"];
  technique_label: Activity["description"];
  kind: string;
  location: Resource["name"];
  staff_booked: string | null;
  comments: string;
  time_constraint: string | null;
  last_notified_time: string;
  overlap_allowed: boolean;
  date_modified: string;
  date_when_booked: string;
  state: Record<string, string>;
}

/**
 * AppointmentStatus
 * The free/busy status of an appointment.
 * @see https://hl7.org/fhir/ValueSet/appointmentstatus
 */
export enum AppointmentStatus {
  /**
   * None of the participant(s) have finalized their acceptance
   * of the appointment request, and the start/end time might
   * not be set yet.
   */
  PROPOSED = "proposed",
  /**
   * Some or all of the participant(s) have not finalized
   * their acceptance of the appointment request.
   * @alias draft
   */
  PENDING = "pending",
  /**
   * All participant(s) have been considered and the appointment
   * is confirmed to go ahead at the date/times specified.
   * @alias accepted
   */
  BOOKED = "booked",
  /**
   * The patient/patients has/have arrived and is/are waiting to be seen.
   */
  ARRIVED = "arrived",
  /**
   * The planning stages of the appointment are now complete,
   * the encounter resource will exist and will track further status changes.
   *
   * Note that an encounter may exist before the appointment status is
   * fulfilled for many reasons.
   * @alias complete
   */
  FULFILLED = "fulfilled",
  /**
   * The appointment has been cancelled.
   * @alias abandoned
   */
  CANCELLED = "cancelled",
  /**
   * Some or all of the participant(s) have not/did not appear
   * for the appointment (usually the patient).
   * @alias suspended
   */
  NOSHOW = "noshow",
  /**
   * This instance should not have been part of this patient's medical record.
   * @alias error
   * @alias deleted
   */
  ENTERED_IN_ERROR = "entered-in-error",

  /**
   * When checked in, all pre-encounter administrative work is complete,
   * and the encounter may begin.
   * (where multiple patients are involved, they are all present).
   * @alias partial
   */
  CHECKED_IN = "checked-in",
  /**
   * The appointment has been placed on a waitlist, to be scheduled/confirmed
   * in the future when a slot/service is available.
   * A specific time might or might not be pre-allocated.
   */
  WAITLIST = "waitlist",
}

export interface Cluster {
  id: number;
  activities: Activity["technique"][];
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  open_time: string;
  close_time: string;
}

export interface Resource {
  id: string;
  name: string;
  pretty_name: string;
  abbreviation: string;
  category: string;
  tags: string[];
  is_planning: boolean;
  is_treatment: boolean;
  is_consult: boolean;
  operating_hours: OperatingHours[];
  emergency_minutes: number;
}

export const STATE = {
  MOVED: "moved",
  MODIFIED: "modified",
  LOADING: "ehr_loading",
  ERROR: "error",
  OOS: "oos",
  CREATED: "grayos_created",
  NEW: "new",
} as const;

// Métadonnées de cluster attachées à un rendez-vous
export interface ClusterMeta {
  id: number;
  name: string;
  color: string;
}

// Rendez-vous enrichi pour l’UI
export interface EnrichedAppointment extends Appointment {
  clusterMeta?: ClusterMeta;
  techniqueLabel: string;
  isMoved: boolean;
  isModified: boolean;
}

// Horaire d’une machine (avant / après)
export interface MachineSchedule {
  resource?: Resource; // peut être undefined si la resource n’est pas trouvée
  location: string;
  appointments: EnrichedAppointment[];
}

// Structure globale préparée pour l’UI
export interface PreparedData {
  before: MachineSchedule[];
  after: MachineSchedule[];
  clusters: ClusterMeta[];
}

export interface MachineSchedulePair {
  location: string;
  before?: MachineSchedule;
  after?: MachineSchedule;
}