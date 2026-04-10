import React from 'react';
import {
    Users,
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    ChevronRight,
    ArrowLeft,
    Calendar,
    Phone,
    Activity,
    Heart,
    Weight,
    Thermometer,
    FileSignature,
    Edit2,
    MessageSquare
} from 'lucide-react';
import { triggerCall, triggerWhatsApp, triggerSmartCall } from '@/lib/communication';
import { motion, AnimatePresence } from 'framer-motion';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Patient, RiskLevel } from '@/types';
import { PrintPortal } from './PrintPortal';
import { cn } from '@/lib/utils';

export const PatientsView = ({
    patients,
    searchTerm,
    setSearchTerm,
    onSelectPatient
}: {
    patients: Patient[],
    searchTerm: string,
    setSearchTerm: (s: string) => void,
    onSelectPatient: (p: Patient) => void
}) => {
    const [riskFilter, setRiskFilter] = React.useState<string>('ALL');
    const [stageFilter, setStageFilter] = React.useState<string>('ALL');
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const filteredPatients = patients.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = p.phone?.includes(searchTerm);
        const riskMatch = riskFilter === 'ALL' || p.riskLevel === riskFilter;
        const stageMatch = stageFilter === 'ALL' || p.journeyStage === stageFilter;
        return (nameMatch || phoneMatch) && riskMatch && stageMatch;
    });

    const handleExportExcel = () => {
        if (filteredPatients.length === 0) return;

        // Header
        const headers = ["Name", "Phone", "Age", "Journey Stage", "Risk Level", "Last Visit", "BP", "Weight", "Heart Rate", "Temp"];
        
        // Rows
        const rows = filteredPatients.map(p => [
            p.name,
            p.phone,
            p.age,
            p.journeyStage,
            p.riskLevel,
            p.lastVisit || '',
            p.vitals?.bp || '',
            p.vitals?.weight || '',
            p.vitals?.heartRate || '',
            p.vitals?.temp || ''
        ]);

        // CSV Construction
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(field => `"${field}"`).join(","))
        ].join("\n");

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `JANMASETHU_PATIENTS_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Patient Registry</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Total {patients.length} patients under management</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="relative flex-1 min-w-[200px] md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-xl border-slate-200"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={cn(
                                    "rounded-xl border-slate-200 font-bold uppercase text-[10px] tracking-widest gap-2 transition-all",
                                    (riskFilter !== 'ALL' || stageFilter !== 'ALL' || isFilterOpen) && "bg-primary/5 border-primary/40 text-primary shadow-sm"
                                )}
                            >
                                <Filter className="h-4 w-4" /> 
                                Filter 
                                {(riskFilter !== 'ALL' || stageFilter !== 'ALL') && (
                                    <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
                                )}
                            </Button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <>
                                        {/* Overlay to close on outside click */}
                                        <div 
                                            className="fixed inset-0 z-40 bg-transparent" 
                                            onClick={() => setIsFilterOpen(false)} 
                                        />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 top-full mt-3 w-[300px] md:w-[350px] bg-card border border-border shadow-2xl rounded-[2rem] p-6 z-50 ring-1 ring-black/5"
                                        >
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Risk Severity Matrix</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {['ALL', 'RED', 'YELLOW', 'GREEN'].map((r) => (
                                                            <button
                                                                key={r}
                                                                onClick={() => setRiskFilter(r)}
                                                                className={cn(
                                                                    "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between",
                                                                    riskFilter === r 
                                                                        ? "bg-primary text-primary-foreground border-primary" 
                                                                        : "bg-muted/50 text-muted-foreground border-border hover:border-primary/20"
                                                                )}
                                                            >
                                                                {r === 'ALL' ? 'Total Pool' : r}
                                                                {riskFilter === r && <div className="h-1 w-1 rounded-full bg-white" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-border">
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Journey Orchestration</p>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {[
                                                            { id: 'ALL', label: 'All Engagement Stages' },
                                                            { id: 'trying_to_conceive', label: 'TTC Tracking' },
                                                            { id: 'pregnancy', label: 'Active Pregnancy' },
                                                            { id: 'postpartum', label: 'Postpartum Monitoring' }
                                                        ].map((s) => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setStageFilter(s.id)}
                                                                className={cn(
                                                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between",
                                                                    stageFilter === s.id 
                                                                        ? "bg-slate-900 text-white border-slate-900" 
                                                                        : "bg-muted/50 text-muted-foreground border-border hover:border-slate-400"
                                                                )}
                                                            >
                                                                {s.label}
                                                                {stageFilter === s.id && <div className="h-1 w-1 rounded-full bg-white" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-2">
                                                    <Button 
                                                        variant="ghost"
                                                        className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:bg-muted"
                                                        onClick={() => {
                                                            setRiskFilter('ALL');
                                                            setStageFilter('ALL');
                                                        }}
                                                    >
                                                        Reset
                                                    </Button>
                                                    <Button 
                                                        className="flex-[2] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 border-none h-10 font-black uppercase text-[10px] tracking-widest"
                                                        onClick={() => setIsFilterOpen(false)}
                                                    >
                                                        Refine View
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button 
                            variant="outline" 
                            onClick={handleExportExcel}
                            disabled={filteredPatients.length === 0}
                            className="rounded-xl border-slate-200 font-bold uppercase text-[10px] tracking-widest gap-2"
                        >
                            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>


            <Card className="border-none shadow-2xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-card ring-1 ring-border">
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px] lg:min-w-full">
                    <TableHeader className="bg-muted/50">

                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest py-6 px-8">Patient Identity</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Journey Stage</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 text-center">Risk Level</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Last Engagement</TableHead>
                            <TableHead className="text-right py-6 px-8"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow
                                key={patient.id}
                                className="hover:bg-muted/50 cursor-pointer border-border group"
                                onClick={() => onSelectPatient(patient)}
                            >

                                <TableCell className="py-6 px-8 font-medium">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {patient.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground leading-none">{patient.name || 'Anonymous Patient'}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{patient.phone || 'No Phone'} • {patient.age || '??'}y</p>
                                        </div>


                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-lg bg-teal-50 text-teal-600 border-teal-100 font-black uppercase text-[9px] tracking-tighter">
                                        {patient.journeyStage?.replace(/_/g, ' ') || 'Registered'}
                                    </Badge>

                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase border",
                                            patient.riskLevel === 'RED' ? "bg-red-50 text-red-600 border-red-100" :
                                                patient.riskLevel === 'YELLOW' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                                patient.riskLevel === 'RED' ? "bg-red-500" :
                                                    patient.riskLevel === 'YELLOW' ? "bg-amber-500" : "bg-emerald-500"
                                            )} />
                                            {patient.riskLevel}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-bold text-xs uppercase tabular-nums">
                                    {new Date(patient.lastVisit || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </TableCell>

                                <TableCell className="text-right px-8">
                                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white border-transparent hover:border-slate-100 border transition-all">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </Card>
        </div>
    );
};

export const PatientDetailView = ({
    patient,
    onBack,
    onSchedule,
    onUpdate
}: {
    patient: Patient,
    onBack: () => void,
    onSchedule: () => void,
    onUpdate: (id: string, updates: Partial<Patient>) => Promise<{ success: boolean, error?: string }>
}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedPatient, setEditedPatient] = React.useState<Partial<Patient>>(patient);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleDownloadPDF = () => {
        window.print();
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await onUpdate(patient.id, editedPatient);
        if (res.success) {
            setIsEditing(false);
        } else {
            alert("Failed to update patient: " + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button variant="ghost" onClick={onBack} className="rounded-xl group font-black uppercase text-[10px] tracking-[0.2em] gap-2 w-fit">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Registry
                </Button>
                <div className="flex items-center gap-2 md:gap-3">
                    {isEditing ? (
                         <>
                            <Button 
                                variant="ghost" 
                                onClick={() => setIsEditing(false)} 
                                className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSave}
                                className="rounded-xl bg-emerald-600 text-white font-bold uppercase text-[10px] tracking-widest gap-2 h-10 px-6"
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                         </>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditing(true)}
                                className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-border flex-1 sm:flex-none"
                            >
                                <Edit2 className="h-3 w-3 mr-2" /> Edit Profile
                            </Button>
                            <Button
                                className="rounded-xl bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest gap-2 h-10 px-4 md:px-6 flex-1 sm:flex-none"
                                onClick={onSchedule}
                            >
                                <Plus className="h-4 w-4" /> Consult
                            </Button>
                        </>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column: Patient Profile */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-2xl md:rounded-[3rem] bg-card overflow-hidden p-6 md:p-8 text-center ring-1 ring-border">

                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-muted flex items-center justify-center border border-border overflow-hidden shadow-inner">
                                    <span className="text-4xl font-black text-muted-foreground group-hover:scale-110 transition-transform">{patient.name?.charAt(0) || '?'}</span>
                                </div>

                                <div className={cn(
                                    "absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl border-4 border-white flex items-center justify-center",
                                    patient.riskLevel === 'RED' ? "bg-red-500" :
                                        patient.riskLevel === 'YELLOW' ? "bg-amber-500" : "bg-emerald-500"
                                )}>
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                            </div>
                             <div className="mt-8 pt-8 border-t border-border w-full space-y-4 text-left">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Identity</p>
                                            <Input 
                                                value={editedPatient.name} 
                                                onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
                                                className="rounded-xl border-slate-200 font-bold"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Age</p>
                                                <Input 
                                                    type="number"
                                                    value={editedPatient.age} 
                                                    onChange={(e) => setEditedPatient({...editedPatient, age: parseInt(e.target.value)})}
                                                    className="rounded-xl border-slate-200 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Contact</p>
                                                <Input 
                                                    value={editedPatient.phone} 
                                                    onChange={(e) => setEditedPatient({...editedPatient, phone: e.target.value})}
                                                    className="rounded-xl border-slate-200 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-black text-foreground tracking-tight leading-none text-center">{patient.name || 'Anonymous'}</h2>
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-2 text-center">{patient.phone || 'No Phone'} • {patient.age || '??'} Years Old</p>
                                        <div className="mt-6 w-full flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 rounded-2xl bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 gap-2 h-12 font-black uppercase text-[10px] tracking-widest"
                                                onClick={() => triggerSmartCall(patient.phone)}
                                            >
                                                <Phone className="h-4 w-4" /> Call
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 rounded-2xl bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:border-green-200 gap-2 h-12 font-black uppercase text-[10px] tracking-widest"
                                                onClick={() => triggerWhatsApp(patient.phone)}
                                            >
                                                <MessageSquare className="h-4 w-4" /> Message
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-2xl rounded-2xl md:rounded-[3rem] bg-slate-900 text-white p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black uppercase tracking-widest opacity-60">Current Vitals</h4>
                            {isEditing && <span className="text-[8px] font-black uppercase bg-primary px-2 py-0.5 rounded text-white italic">Edit Active</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'BP', value: editedPatient.vitals?.bp, key: 'bp', icon: Activity, color: 'text-rose-400' },
                                { label: 'Weight', value: editedPatient.vitals?.weight, key: 'weight', icon: Weight, color: 'text-sky-400' },
                                { label: 'Heart Rate', value: editedPatient.vitals?.heartRate, key: 'heartRate', icon: Heart, color: 'text-emerald-400' },
                                { label: 'Temperature', value: editedPatient.vitals?.temp, key: 'temp', icon: Thermometer, color: 'text-amber-400' },
                            ].map((vital, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <vital.icon className={cn("h-4 w-4 opacity-100", vital.color)} />
                                        <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{vital.label}</span>
                                    </div>
                                    {isEditing ? (
                                        <Input 
                                            value={vital.value}
                                            onChange={(e) => setEditedPatient({
                                                ...editedPatient, 
                                                vitals: { ...editedPatient.vitals!, [vital.key]: e.target.value }
                                            })}
                                            className="h-8 bg-white/10 border-white/20 text-white font-black text-sm rounded-lg"
                                        />
                                    ) : (
                                        <p className="text-lg font-black tabular-nums">{vital.value || 'N/A'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Timeline & Documents */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <Card className="border-none shadow-2xl rounded-2xl md:rounded-[3rem] bg-card overflow-hidden h-full ring-1 ring-border">
                        <CardHeader className="p-6 md:p-8 border-b border-border">
                            <CardTitle className="text-xl font-black text-foreground">Clinical History</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-tighter text-primary/60">Timeline of care engagement</CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8">
                            <div className="space-y-6 md:space-y-8 relative">
                                <div className="absolute left-6 top-1 bottom-1 w-px bg-slate-100" />

                                {[
                                    { title: 'Obstetric Consultation', time: 'Yesterday, 10:45 AM', type: 'Clinical Notes', icon: FileSignature, color: 'bg-primary/10 text-primary' },
                                    { title: 'Blood Work Report', time: 'Oct 24, 2026', type: 'Laboratory', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
                                    { title: 'Triage Check-in', time: 'Oct 22, 2026', type: 'Nurse Triage', icon: Weight, color: 'bg-indigo-50 text-indigo-600' },
                                ].map((event, i) => (
                                    <div key={i} className="flex gap-4 md:gap-10 relative">
                                        <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm", event.color)}>
                                            <event.icon className="h-5 w-5 md:h-6 md:w-6" />
                                        </div>
                                        <div className="group flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter tabular-nums">{event.time}</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{event.type}</p>

                                            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100/50 transition-colors animate-in fade-in slide-in-from-top-2">
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">Standard clinical evaluation conducted. Vital signs within normal parameters for the patient's gestational stage.</p>
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    onClick={handleDownloadPDF}
                                                    className="p-0 h-auto mt-2 text-[10px] font-bold uppercase text-primary hover:no-underline no-print"
                                                >
                                                    Download Clinical Profile (PDF)
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* High-Fidelity Print Report Template (Rendered via Portal) */}
            <PrintPortal>
                <div className="hidden print:block bg-white p-16 text-slate-950 overflow-visible font-sans clinical-pdf-report">
                    <div className="border-b-[6px] border-slate-950 pb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Clinical Summary Report</h1>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-950">DFOCLINIC</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Documentation Unit</p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-12 pb-12 border-b-2 border-slate-100">
                        <section>
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Patient Particulars</h4>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-slate-950">{patient.name}</p>
                                <p className="text-sm font-bold text-slate-600">ID: {patient.id?.substring(0, 12)}</p>
                                <p className="text-sm font-bold text-slate-600">{patient.age} Years &bull; F</p>
                            </div>
                        </section>
                        <section className="text-right">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Patient Contact</h4>
                            <p className="text-xl font-black text-slate-950">{patient.phone}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-widest">Registered Registry Contact</p>
                        </section>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-12">
                        <section>
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 decoration-slate-950 underline underline-offset-8">Physiological Risk Profile</h4>
                            <div className="p-8 border-l-[12px] border-slate-950 bg-slate-50 transition-all">
                                <p className="text-sm font-black text-slate-400 mb-1 uppercase tracking-widest">Assessed Risk Factor</p>
                                <p className={cn(
                                    "text-3xl font-black uppercase",
                                    patient.riskLevel === 'RED' ? "text-red-500" :
                                    patient.riskLevel === 'YELLOW' ? "text-amber-500" : "text-emerald-500"
                                )}>
                                    {patient.riskLevel} ALERT
                                </p>
                            </div>
                        </section>

                        <div className="mt-0">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 bg-slate-50 p-1 px-2 border-l-2 border-slate-900">Vital Statistics (Current)</h2>
                            <div className="grid grid-cols-4 gap-4 p-8 bg-slate-50 border border-slate-100 rounded-2xl">
                                {[
                                    { label: 'BP', value: patient.vitals?.bp || 'N/A' },
                                    { label: 'Weight', value: patient.vitals?.weight ? patient.vitals.weight + ' kg' : 'N/A' },
                                    { label: 'Pulse', value: patient.vitals?.heartRate ? patient.vitals.heartRate + ' bpm' : 'N/A' },
                                    { label: 'Temp', value: patient.vitals?.temp ? patient.vitals.temp + ' °F' : 'N/A' },
                                ].map((v, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{v.label}</p>
                                        <p className="text-lg font-black mt-1">{v.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 bg-slate-50 p-1 px-2 border-l-2 border-slate-900">Clinical Timeline & Notes</h2>
                        <div className="border border-slate-100 rounded-2xl p-8 space-y-6">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                <div>
                                    <p className="font-black">Obstetric Consultation Summary</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Verified Content</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date().toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm font-medium leading-relaxed italic text-slate-600">
                                "Comprehensive clinical evaluation completed. Fetal monitoring suggests healthy development.
                                 Maternal vitals are stable. Recommendation: Continue standard prenatal vitamin regimen 
                                 and maintain follow-up schedule as documented in JanmaSethu Clinical OS."
                            </p>
                        </div>
                    </div>

                    <div className="mt-24 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40">
                        <p className="text-[9px] font-bold uppercase tracking-widest">Digitally Signed EHR &bull; ID: {patient.id?.substring(0, 8)}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest">Page 01 of 01</p>
                    </div>
                </div>
            </PrintPortal>
        </div>
    );
};
