import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Resume, ResumeSection, SectionType } from '@/types/resume';
import { sampleResumes, createBlankResume } from '@/lib/default-resume';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google';
  neonDbUrl?: string;
  neonConnected?: boolean;
}

interface ResumeStoreState {
  user: UserProfile | null;
  resumes: Resume[];
  activeResumeId: string;
  isAiProcessing: boolean;
  aiStatusMessage: string;

  // Auth actions
  loginWithGoogle: (customUser?: Partial<UserProfile>) => void;
  logout: () => void;
  setNeonDbConfig: (url: string) => Promise<{ success: boolean; message: string }>;

  // Resume actions
  setActiveResumeId: (id: string) => void;
  getActiveResume: () => Resume;
  createResume: (title?: string) => string;
  updateActiveResume: (updater: Partial<Resume> | ((prev: Resume) => Resume)) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => string;
  importResume: (resume: Resume) => string;

  // Enhancv-style section actions
  reorderSections: (newSections: ResumeSection[]) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  addSection: (type: SectionType, title?: string) => void;
  deleteSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;

  // Item actions within section
  addSectionItem: (sectionId: string, itemData?: any) => void;
  updateSectionItem: (sectionId: string, itemId: string, itemData: any) => void;
  deleteSectionItem: (sectionId: string, itemId: string) => void;

  // AI loading status
  setAiStatus: (processing: boolean, message?: string) => void;
}

const defaultUser: UserProfile = {
  id: 'user-google-1',
  name: 'Alex Vance',
  email: 'alex.vance@techfrontier.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'google',
  neonConnected: true,
};

export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      resumes: sampleResumes,
      activeResumeId: sampleResumes[0].id,
      isAiProcessing: false,
      aiStatusMessage: '',

      loginWithGoogle: (customUser) => {
        const newUser: UserProfile = {
          id: customUser?.id || `user-google-${Date.now()}`,
          name: customUser?.name || 'Alex Vance',
          email: customUser?.email || 'alex.vance@gmail.com',
          avatar: customUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          provider: 'google',
          neonConnected: true,
          ...customUser,
        };
        set({ user: newUser });
      },

      logout: () => {
        set({ user: null });
      },

      setNeonDbConfig: async (url: string) => {
        // Validation for postgres/neon format
        if (!url || (!url.startsWith('postgres://') && !url.startsWith('postgresql://'))) {
          return { success: false, message: 'Invalid Neon PostgreSQL connection string.' };
        }
        set((state) => ({
          user: state.user
            ? { ...state.user, neonDbUrl: url, neonConnected: true }
            : {
                id: 'user-google-custom',
                name: 'Google User',
                email: 'user@gmail.com',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                provider: 'google',
                neonDbUrl: url,
                neonConnected: true,
              },
        }));
        return { success: true, message: 'Connected to Neon Database successfully!' };
      },

      setActiveResumeId: (id: string) => {
        set({ activeResumeId: id });
      },

      getActiveResume: () => {
        const { resumes, activeResumeId } = get();
        return resumes.find((r) => r.id === activeResumeId) || resumes[0] || sampleResumes[0];
      },

      createResume: (title = 'New Resume') => {
        const userId = get().user?.id || 'guest';
        const newResume = createBlankResume(userId);
        newResume.title = title;
        set((state) => ({
          resumes: [newResume, ...state.resumes],
          activeResumeId: newResume.id,
        }));
        return newResume.id;
      },

      updateActiveResume: (updater) => {
        set((state) => {
          const current = state.resumes.find((r) => r.id === state.activeResumeId);
          if (!current) return state;

          const updated =
            typeof updater === 'function' ? updater(current) : { ...current, ...updater };
          updated.updatedAt = new Date().toISOString();

          return {
            resumes: state.resumes.map((r) => (r.id === state.activeResumeId ? updated : r)),
          };
        });
      },

      deleteResume: (id: string) => {
        set((state) => {
          const filtered = state.resumes.filter((r) => r.id !== id);
          const nextActive = filtered.length > 0 ? filtered[0].id : '';
          return {
            resumes: filtered.length > 0 ? filtered : [createBlankResume(state.user?.id || 'guest')],
            activeResumeId: nextActive || filtered[0]?.id || '',
          };
        });
      },

      duplicateResume: (id: string) => {
        const target = get().resumes.find((r) => r.id === id);
        if (!target) return '';
        const cloned: Resume = {
          ...JSON.parse(JSON.stringify(target)),
          id: `res-${Date.now()}`,
          title: `${target.title} (Copy)`,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          resumes: [cloned, ...state.resumes],
          activeResumeId: cloned.id,
        }));
        return cloned.id;
      },

      importResume: (resume: Resume) => {
        const imported: Resume = {
          ...resume,
          id: `res-import-${Date.now()}`,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          resumes: [imported, ...state.resumes],
          activeResumeId: imported.id,
        }));
        return imported.id;
      },

      reorderSections: (newSections: ResumeSection[]) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: newSections,
        }));
      },

      moveSection: (fromIndex: number, toIndex: number) => {
        const resume = get().getActiveResume();
        if (!resume || fromIndex < 0 || toIndex < 0 || fromIndex >= resume.sections.length || toIndex >= resume.sections.length) return;

        const updated = [...resume.sections];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);

        get().updateActiveResume({ sections: updated });
      },

      addSection: (type: SectionType, title?: string) => {
        const defaultTitles: Record<SectionType, string> = {
          experience: 'Work Experience',
          education: 'Education',
          skills: 'Skills & Competencies',
          projects: 'Notable Projects',
          certifications: 'Certifications & Licenses',
          custom: title || 'Custom Section',
        };

        const newSec: ResumeSection = {
          id: `sec-${Date.now()}`,
          type,
          title: title || defaultTitles[type],
          visible: true,
          items: [],
        };

        // Add a default starting item based on section type
        if (type === 'experience') {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              role: 'Role / Position',
              company: 'Company Name',
              location: 'City, State',
              startDate: '2023-01',
              endDate: '',
              current: true,
              description: '',
              bullets: ['Accomplished key milestones and exceeded target KPIs.'],
            },
          ];
        } else if (type === 'skills') {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              category: 'Key Skills',
              skills: [
                { id: `sk-1`, name: 'Primary Skill', level: 'Expert' },
                { id: `sk-2`, name: 'Secondary Skill', level: 'Advanced' },
              ],
            },
          ];
        } else if (type === 'education') {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              degree: 'Degree / Major',
              institution: 'Institution Name',
              location: 'Location',
              startDate: '2019-09',
              endDate: '2023-05',
              current: false,
              gpa: '',
              highlights: [],
            },
          ];
        } else if (type === 'projects') {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              title: 'Project Title',
              subtitle: 'Short project summary',
              link: '',
              startDate: '',
              endDate: '',
              description: 'Project overview and scope.',
              bullets: ['Key outcome or architecture decision.'],
              techStack: ['TypeScript', 'Next.js'],
            },
          ];
        } else if (type === 'certifications') {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              name: 'Certificate Name',
              issuer: 'Issuing Organization',
              date: '2024',
              url: '',
            },
          ];
        } else {
          newSec.items = [
            {
              id: `item-${Date.now()}`,
              title: 'Custom Field Item',
              subtitle: 'Subtitle or Organization',
              date: '2024',
              description: 'Custom notes and relevant information.',
              bullets: ['Important bullet point or achievement.'],
              tags: ['Custom Tag'],
            },
          ];
        }

        get().updateActiveResume((prev) => ({
          ...prev,
          sections: [...prev.sections, newSec],
        }));
      },

      deleteSection: (sectionId: string) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.filter((s) => s.id !== sectionId),
        }));
      },

      toggleSectionVisibility: (sectionId: string) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s
          ),
        }));
      },

      updateSectionTitle: (sectionId: string, title: string) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
        }));
      },

      addSectionItem: (sectionId: string, itemData?: any) => {
        const resume = get().getActiveResume();
        const section = resume.sections.find((s) => s.id === sectionId);
        if (!section) return;

        let newItem: any;
        if (itemData) {
          newItem = { id: `item-${Date.now()}`, ...itemData };
        } else {
          switch (section.type) {
            case 'experience':
              newItem = {
                id: `exp-${Date.now()}`,
                role: 'Role Title',
                company: 'Company',
                location: 'Remote',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                bullets: ['Delivered key business objective with measurable impact.'],
              };
              break;
            case 'education':
              newItem = {
                id: `edu-${Date.now()}`,
                degree: 'Degree Name',
                institution: 'School / University',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                gpa: '',
                highlights: [],
              };
              break;
            case 'skills':
              newItem = {
                id: `skg-${Date.now()}`,
                category: 'Category Name',
                skills: [{ id: `sk-${Date.now()}`, name: 'New Skill', level: 'Intermediate' }],
              };
              break;
            case 'projects':
              newItem = {
                id: `proj-${Date.now()}`,
                title: 'New Project',
                subtitle: '',
                link: '',
                startDate: '',
                endDate: '',
                description: '',
                bullets: ['Key deliverable achieved.'],
                techStack: [],
              };
              break;
            case 'certifications':
              newItem = {
                id: `cert-${Date.now()}`,
                name: 'Certification Name',
                issuer: 'Issuer',
                date: '',
                url: '',
              };
              break;
            default:
              newItem = {
                id: `cust-${Date.now()}`,
                title: 'Item Title',
                subtitle: '',
                date: '',
                description: '',
                bullets: [],
                tags: [],
              };
              break;
          }
        }

        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
          ),
        }));
      },

      updateSectionItem: (sectionId: string, itemId: string, itemData: any) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  items: s.items.map((item) => (item.id === itemId ? { ...item, ...itemData } : item)),
                }
              : s
          ),
        }));
      },

      deleteSectionItem: (sectionId: string, itemId: string) => {
        get().updateActiveResume((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, items: s.items.filter((item) => item.id !== itemId) } : s
          ),
        }));
      },

      setAiStatus: (processing: boolean, message = '') => {
        set({ isAiProcessing: processing, aiStatusMessage: message });
      },
    }),
    {
      name: 'resuflow-resume-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
      }),
    }
  )
);
