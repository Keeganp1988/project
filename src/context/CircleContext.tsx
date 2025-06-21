import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, arrayUnion, getDoc, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface Member {
  id: string;
  name: string;
  location?: { latitude: number; longitude: number; timestamp: number };
  battery?: { level: number; isCharging: boolean };
  lastSeen?: number;
  isOnline?: boolean;
}

interface Circle {
  id: string;
  name: string;
  members: Member[];
  code: string;
  inviteCode: string;
}

interface CircleContextType {
  circles: Circle[];
  activeCircle: Circle | null;
  setActiveCircle: (circle: Circle | null) => void;
  createCircle: (name: string) => Promise<void>;
  joinCircle: (code: string) => Promise<void>;
  updateMemberLocation: (location: { latitude: number; longitude: number }) => Promise<void>;
  updateMemberBattery: (battery: { level: number; isCharging: boolean }) => Promise<void>;
  loading: boolean;
}

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export const CircleProvider = ({ children }: { children: ReactNode }) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [activeCircle, setActiveCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCircles([]);
      setActiveCircle(null);
      setLoading(false);
      return;
    }

    const circlesCollection = collection(db, 'circles');
    const unsubscribe = onSnapshot(circlesCollection, (snapshot) => {
      const circleData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Circle))
        .filter((circle) => circle.members.some((member) => member.id === user.uid));
      setCircles(circleData);
      setActiveCircle((prev) => circleData.find((c) => c.id === prev?.id) || circleData[0] || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createCircle = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await addDoc(collection(db, 'circles'), {
      name,
      members: [{ id: user.uid, name: user.displayName || 'Anonymous' }],
      code,
      inviteCode: code, // Use same code for invite
    });
  };

  const joinCircle = async (code: string) => {
    if (!user) throw new Error('User not authenticated');
    const circlesCollection = collection(db, 'circles');
    const querySnapshot = await getDocs(circlesCollection);
    const circleDoc = querySnapshot.docs.find((doc: QueryDocumentSnapshot) => doc.data().code === code);
    if (!circleDoc) throw new Error('Invalid circle code');

    await updateDoc(doc(db, 'circles', circleDoc.id), {
      members: arrayUnion({ id: user.uid, name: user.displayName || 'Anonymous' }),
    });
  };

  const updateMemberLocation = async (location: { latitude: number; longitude: number }) => {
    if (!user || !activeCircle) throw new Error('No user or active circle');
    const circleRef = doc(db, 'circles', activeCircle.id);
    const circleDoc = await getDoc(circleRef);
    if (!circleDoc.exists()) throw new Error('Circle not found');

    const circle = circleDoc.data() as Circle;
    const updatedMembers = circle.members.map((member) =>
      member.id === user.uid ? { ...member, location: { ...location, timestamp: Date.now() } } : member
    );

    await updateDoc(circleRef, { members: updatedMembers });
  };

  const updateMemberBattery = async (battery: { level: number; isCharging: boolean }) => {
    if (!user || !activeCircle) throw new Error('No user or active circle');
    const circleRef = doc(db, 'circles', activeCircle.id);
    const circleDoc = await getDoc(circleRef);
    if (!circleDoc.exists()) throw new Error('Circle not found');

    const circle = circleDoc.data() as Circle;
    const updatedMembers = circle.members.map((member) =>
      member.id === user.uid ? { ...member, battery } : member
    );

    await updateDoc(circleRef, { members: updatedMembers });
  };

  return (
    <CircleContext.Provider
      value={{
        circles,
        activeCircle,
        setActiveCircle,
        createCircle,
        joinCircle,
        updateMemberLocation,
        updateMemberBattery,
        loading,
      }}
    >
      {children}
    </CircleContext.Provider>
  );
};

export const useCircle = () => {
  const context = useContext(CircleContext);
  if (!context) throw new Error('useCircle must be used inside a CircleProvider');
  return context;
};