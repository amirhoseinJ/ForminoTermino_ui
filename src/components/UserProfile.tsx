import {useState, useEffect, useMemo} from "react";
import {
    ArrowLeft,
    User,
    FileText,
    Download,
    Trash2,
    Edit,
    Save,
    X,
    Shield,
    MapPin,
    Phone,
    Camera
} from "lucide-react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import {motion, AnimatePresence} from "motion/react";
import Robot3DAvatar from "./Robot3DAvatar";
import type {Page} from "../types/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";

interface UserProfileProps {
    onNavigate: (page: Page) => void;
}


function getProfilePlaceholder(name?: string | null) {
    const display = name && name.trim() ? encodeURIComponent(name) : "User";
    return `https://ui-avatars.com/api/?name=${display}&background=eee&color=888&rounded=true&size=128`;
}

interface UserData {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    occupation: string;
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    preferences: {
        language: string;
        timezone: string;
        dark: boolean;
    };
    profileImage?: string | null;
}

interface Document {
    documentId: string;
    file_url: string;
    tag: string;
    uploaded_at: string;
    name: string;
}


const blankUserData: UserData = {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    occupation: "",
    emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
    },
    preferences: {
        language: "",
        timezone: "",
        dark: false,
    },
    profileImage: null
};


const API_BASE = import.meta.env.BASE_URL


export default function UserProfile({onNavigate}: UserProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'documents'>('profile');
    const [userData, setUserData] = useState<UserData>(blankUserData);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [removeProfileImage, setRemoveProfileImage] = useState(false);

    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [draftName, setDraftName] = useState<string>("");


    const handleDeleteProfileImage = () => {
        setProfileImagePreview(null);
        setProfileImageFile(null);
        setRemoveProfileImage(true);
    };




    // Common IANA timezones (expand as you like)
    const TIMEZONES = [
        "UTC",
        "Asia/Dubai",
        "Asia/Tehran",
        "Europe/London",
        "Europe/Berlin",
        "Europe/Paris",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Asia/Kolkata",
        "Asia/Tokyo",
        "Asia/Singapore",
        "Australia/Sydney",
    ];

    const tzLabel = (tz: string) => tz.replace("_", " ");




    const [documents, setDocuments] = useState<Document[]>([]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        fetch(`${API_BASE}/api/users/profile/`, {
            // Remove credentials if using JWT (not needed)
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user data");
                return res.json();
            })
            .then(data => {
                // Map flat backend data to nested UserData shape
                setUserData({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    dateOfBirth: data.dateOfBirth || "",
                    address: data.address || "",
                    occupation: data.occupation || "",
                    emergencyContact: {
                        name: data.emergencyContactName || "",
                        relationship: data.emergencyContactRelationship || "",
                        phone: data.emergencyContactPhone || "",
                    },
                    preferences: {
                        language: data.language || "",
                        timezone: data.timezone || "",
                        dark: data.dark ?? false,
                    },
                    profileImage: data.profileImage || null
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch(`${API_BASE}/api/users/documents/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch documents");
                return res.json();
            })
            .then((docs: Document[]) => {
                setDocuments(docs);
            })
            .catch(err => {
                console.error(err);
                // optionally set an error state
            });
    }, []);


    //  If a new file is chosen, show preview
    useEffect(() => {
        if (!profileImageFile) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(profileImageFile);
    }, [profileImageFile]);


    const handleSave = () => {
        const token = localStorage.getItem('accessToken');
        setIsEditing(false);

        // Flatten userData before sending
        const body = {
            fullName: userData.fullName,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            address: userData.address,
            occupation: userData.occupation,
            emergencyContactName: userData.emergencyContact.name,
            emergencyContactRelationship: userData.emergencyContact.relationship,
            emergencyContactPhone: userData.emergencyContact.phone,
            language: userData.preferences.language,
            timezone: userData.preferences.timezone,
            dark: userData.preferences.dark,
            // Don't send email if you want it read-only on backend
            // email: userData.email,
            profileImage: userData.profileImage,

        };

        if (removeProfileImage) {
            body.profileImage = ""; // Signal backend to clear it
        } else if (profileImagePreview) {
            body.profileImage = profileImagePreview;
        }

        fetch(`${API_BASE}/api/users/profile/`, {
            method: 'PATCH',  // Use PATCH for partial update, or PUT for full update
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update user data");
                return res.json();
            })
            .then(data => {
                setUserData({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    dateOfBirth: data.dateOfBirth || "",
                    address: data.address || "",
                    occupation: data.occupation || "",
                    emergencyContact: {
                        name: data.emergencyContactName || "",
                        relationship: data.emergencyContactRelationship || "",
                        phone: data.emergencyContactPhone || "",
                    },
                    preferences: {
                        language: data.language || "",
                        timezone: data.timezone || "",
                        dark: data.dark ?? false,
                    },
                    profileImage: data.profileImage || null,
                });
                setProfileImageFile(null);
                setProfileImagePreview(data.profileImage || null);
                setRemoveProfileImage(false);
            })
            .catch(err => {
                alert('Failed to update profile: ' + err.message);
            });
    };


    const handleCancel = () => {
        setIsEditing(false);
        setProfileImageFile(null);
        setProfileImagePreview(userData.profileImage || null);
        setRemoveProfileImage(false);
        // Reset form data if needed
    };


    // [8] Handle profile image upload
    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Accept only images
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        setProfileImageFile(file);
        setRemoveProfileImage(false);
    };


    const displayedImageSrc = useMemo(() => {
        if (profileImagePreview) {
            return profileImagePreview;                           // 1) new upload
        }
        if (removeProfileImage) {
            return getProfilePlaceholder(userData.fullName);      // 2) user hit Delete
        }
        if (userData.profileImage) {
            return userData.profileImage;                         // 3) saved image
        }
        return getProfilePlaceholder(userData.fullName);        // 4) fallback
    }, [
        profileImagePreview,
        removeProfileImage,
        userData.profileImage,
        userData.fullName,
    ]);


    // --- [9] Render profile image block ---
    const renderProfileImageSection = () => (
        <div className="flex flex-col items-center gap-2 mb-8">
            <div className="relative">
                <img
                    src={displayedImageSrc}
                    alt="Profile"
                    className="rounded-full border-2 border-glass-border shadow-lg object-cover w-28 h-28"
                />
                {isEditing && (
                    <label
                        className="absolute bottom-0 right-0 bg-glass-bg rounded-full p-2 cursor-pointer shadow-md border border-glass-border hover:bg-neon-purple/30 transition">
                        <Camera className="h-5 w-5 text-neon-purple"/>
                        <input
                            type="file"
                            accept="image/*"
                            onClick={(e) => {
                                // allow re-selecting the same file after delete
                                (e.currentTarget as HTMLInputElement).value = "";
                            }}
                            onChange={handleProfileImageChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            {isEditing && (profileImagePreview || userData.profileImage) && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteProfileImage}
                    className="mt-2 border-destructive text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="h-4 w-4 mr-2"/>
                    Delete Photo
                </Button>
            )}
            <span className="text-xs text-muted-foreground mt-1">
      {isEditing ? "Upload a square image (JPG/PNG, max 2MB)" : ""}
    </span>
        </div>
    );


    //   const handleDocumentUpload = () => {
    //   // Simulate file upload
    //   const newDoc: Document = {
    //     id: Date.now().toString(),
    //     name: 'New Document.pdf',
    //     type: 'PDF',
    //     size: '1.5 MB',
    //     uploadDate: new Date(),
    //     category: 'other'
    //   };
    //   setDocuments(prev => [...prev, newDoc]);
    // };


    const handleDocumentDelete = async (id: string) => {
        // 1) Ask for confirmation
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }

        // 2) If you have a backend DELETE endpoint, call it here:
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_BASE}/api/users/documents/${id}/`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token}`},
            });
            if (!res.ok) throw new Error("Failed to delete on server");
            // 3) On success, update local state
            setDocuments((docs) => docs.filter((d) => d.documentId !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Unknown error");
        }
    };


    // const getCategoryColor = (category: string) => {
    //   const colors = {
    //     identity: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    //     education: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    //     employment: 'bg-green-500/10 text-green-500 border-green-500/20',
    //     medical: 'bg-red-500/10 text-red-500 border-red-500/20',
    //     other: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    //   };
    //   return colors[category as keyof typeof colors] || colors.other;
    // };

    const renderProfileForm = () => (
        <div className="space-y-6">
            {renderProfileImageSection()}
            {/* Personal Information */}
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-neon-purple"/>
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                            <Input
                                value={userData.fullName}
                                onChange={(e) => setUserData(prev => ({...prev, fullName: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-input-background border-glass-border"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Date of Birth</label>
                            <Input
                                type="date"
                                value={userData.dateOfBirth}
                                onChange={(e) => setUserData(prev => ({...prev, dateOfBirth: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-input-background border-glass-border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Occupation</label>
                        <Input
                            value={userData.occupation}
                            onChange={(e) => setUserData(prev => ({...prev, occupation: e.target.value}))}
                            disabled={!isEditing}
                            className="bg-input-background border-glass-border"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-neon-green"/>
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                        <Input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}
                            disabled={true}
                            className="bg-input-background border-glass-border"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                        <Input
                            value={userData.phone}
                            onChange={(e) => setUserData(prev => ({...prev, phone: e.target.value}))}
                            disabled={!isEditing}
                            className="bg-input-background border-glass-border"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Address */}
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-500"/>
                        Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Full Address</label>
                        <Input
                            value={userData.address}
                            onChange={(e) => setUserData(prev => ({
                                ...prev,
                                address: e.target.value
                            }))}
                            disabled={!isEditing}
                            className="bg-input-background border-glass-border"
                        />
                    </div>

                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-500"/>
                        Emergency Contact
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                            <Input
                                value={userData.emergencyContact.name}
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    emergencyContact: {...prev.emergencyContact, name: e.target.value}
                                }))}
                                disabled={!isEditing}
                                className="bg-input-background border-glass-border"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Relationship</label>
                            <Input
                                value={userData.emergencyContact.relationship}
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    emergencyContact: {...prev.emergencyContact, relationship: e.target.value}
                                }))}
                                disabled={!isEditing}
                                className="bg-input-background border-glass-border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                        <Input
                            value={userData.emergencyContact.phone}
                            onChange={(e) => setUserData(prev => ({
                                ...prev,
                                emergencyContact: {...prev.emergencyContact, phone: e.target.value}
                            }))}
                            disabled={!isEditing}
                            className="bg-input-background border-glass-border"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Timezone */}
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {/* You can swap to a clock icon if you prefer */}
                        <span className="inline-block w-5 h-5 rounded-full bg-neon-purple/30" />
                        Timezone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Select your timezone
                        </label>

                        {/* shadcn Select bound to userData.preferences.timezone */}
                        <Select
                            value={userData.preferences.timezone || ""}
                            onValueChange={(value) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    preferences: { ...prev.preferences, timezone: value },
                                }))
                            }
                            disabled={!isEditing}
                        >
                            <SelectTrigger className="w-full bg-input-background border-glass-border">
                                <SelectValue placeholder="Choose a timezone" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tzLabel(tz)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <p className="text-xs text-muted-foreground mt-2">
                            This timezone will be used for your calendar and Google event times.
                        </p>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
    const renderDocuments = () => (
        <div className="space-y-6">
            <Card className="glass-card border border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-neon-purple"/>
                        My Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Your uploaded documents.
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-card border border-glass-border">
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {documents.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No documents exist
                            </p>
                        ) : (
                            documents.map((doc, i) => (
                                <motion.div
                                    key={doc.documentId}
                                    className={`p-4 border-b border-glass-border last:border-b-0 hover:bg-glass-bg/50 transition-colors
                ${i === 0 ? 'rounded-t-lg' : ''} ${i === documents.length - 1 ? 'rounded-b-lg' : ''}`}
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: i * 0.1}}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-neon-purple/10 rounded-lg">
                                                <FileText className="h-5 w-5 text-neon-purple"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    <div className="flex items-center gap-4">
                                                        {editingDocId === doc.documentId ? (
                                                            <>
                                                                <Input
                                                                    value={draftName}
                                                                    onChange={e => setDraftName(e.target.value)}
                                                                    className="w-48 text-sm"
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        const token = localStorage.getItem("accessToken");
                                                                        await fetch(
                                                                            `${API_BASE}/api/users/documents/${doc.documentId}/`,
                                                                            {
                                                                                method: "PATCH",
                                                                                headers: {
                                                                                    "Content-Type": "application/json",
                                                                                    Authorization: `Bearer ${token}`,
                                                                                },
                                                                                body: JSON.stringify({name: draftName}),
                                                                            }
                                                                        );
                                                                        // refresh or update local state
                                                                        setDocuments(docs =>
                                                                            docs.map(d =>
                                                                                d.documentId === doc.documentId ? {
                                                                                    ...d,
                                                                                    name: draftName
                                                                                } : d
                                                                            )
                                                                        );
                                                                        setEditingDocId(null);
                                                                    }}
                                                                >
                                                                    <Save className="h-4 w-4"/>
                                                                </Button>
                                                                <Button size="sm" onClick={() => setEditingDocId(null)}>
                                                                    <X className="h-4 w-4"/>
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium text-foreground">{doc.name}</p>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        setEditingDocId(doc.documentId);
                                                                        setDraftName(doc.name);
                                                                    }}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <Edit className="h-4 w-4"/>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>

                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <Badge variant="outline">{doc.tag}</Badge>
                                                    <span>
                        Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-8 w-8 flex items-center justify-center hover:bg-neon-green/10 rounded"
                                            >
                                                <Download className="h-4 w-4 text-neon-green"/>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDocumentDelete(doc.documentId)}
                                                className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500 rounded"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}

                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (

        <>
            {/* Make the native time picker indicator white */}
            <style>
                {`
          input[type="time"]::-webkit-calendar-picker-indicator,
             input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            opacity: 1;
          }
          input[type="time"]::-moz-focus-inner { border: 0; }
          

  /* Firefox quirks */
  input[type="date"]::-moz-focus-inner,
  input[type="time"]::-moz-focus-inner { border: 0; }
          
        `}
            </style>
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Header */}
            <div className="glass-card glass-glow-purple relative z-10 px-4 py-6 border-b border-glass-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('hub')}
                            className="hover:bg-glass-bg hover:text-neon-purple"
                        >
                            <ArrowLeft className="h-5 w-4"/>
                        </Button>
                        <div className="flex items-center gap-4">
                            <Robot3DAvatar size="sm" expression="happy"/>
                            <div>
                                <h1 className="text-lg text-foreground">User Profile</h1>
                                <p className="text-xs text-muted-foreground">Manage your information & documents</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancel}
                                    className="hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-neon-green to-neon-green/80 hover:from-neon-green/90 hover:to-neon-green/70"
                                >
                                    <Save className="h-4 w-4"/>
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
                            >
                                <Edit className="h-4 w-4 mr-2"/>
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'profile' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('profile')}
                        className={`${
                            activeTab === 'profile'
                                ? 'bg-gradient-to-r from-neon-purple to-neon-purple/80 text-white'
                                : 'hover:bg-glass-bg'
                        }`}
                    >
                        <User className="h-4 w-4 mr-2"/>
                        Profile Information
                    </Button>
                    <Button
                        variant={activeTab === 'documents' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('documents')}
                        className={`${
                            activeTab === 'documents'
                                ? 'bg-gradient-to-r from-neon-green to-neon-green/80 text-white'
                                : 'hover:bg-glass-bg'
                        }`}
                    >
                        <FileText className="h-4 w-4 mr-2"/>
                        My Documents
                    </Button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -20}}
                        transition={{duration: 0.3}}
                    >
                        {activeTab === 'profile' ? renderProfileForm() : renderDocuments()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
            </>
    );
}