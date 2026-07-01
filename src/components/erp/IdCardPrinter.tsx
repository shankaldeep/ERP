import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button, Label, Input } from '../UI';
import { type Student } from '../../types';
import { Printer, Search, CreditCard } from 'lucide-react';

export function IdCardPrinter() {
  const { students, schools, currentUser } = useStore();
  const [selectedClass, setSelectedClass] = useState('Class 9');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [printLayout, setPrintLayout] = useState<'portrait' | 'landscape'>('portrait');

  const classes = ['Nursery', 'L.K.G', 'U.K.G', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const classStudents = students.filter(s => s.grade === selectedClass);
  const filteredStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.srNo?.includes(searchTerm))
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Student list sidebar selector */}
      <Card className="p-4 bg-slate-50/50 no-print">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block border-b pb-1">Filter & Search students</h3>
        
        <div className="space-y-3">
          <div>
            <Label>Select Class</Label>
            <Input as="select" value={selectedClass} onChange={e => {
              setSelectedClass(e.target.value);
              setSelectedStudentId('');
            }}>
              {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
            </Input>
          </div>
          <div>
            <Label>Search Student Registrar</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded pl-7 pr-2.5 py-1.5 focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
        </div>

        <div className="mt-4 max-h-[220px] overflow-y-auto space-y-1">
          {filteredStudents.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-4">No matching students found.</p>
          ) : filteredStudents.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs leading-tight block transition-colors ${selectedStudentId === s.id ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-200 bg-white border'}`}
            >
              <p>{s.name}</p>
              <span className="text-[9px] opacity-80 block">Roll: {s.rollNo} | SR No: {s.srNo || 'N/A'}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 border-t pt-3 space-y-2">
            <Label>Print Layout</Label>
            <Input as="select" value={printLayout} onChange={e => setPrintLayout(e.target.value as any)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </Input>
        </div>
      </Card>

      <style>{`
        @media print {
          @page { size: A4 ${printLayout}; margin: 5mm; }
        }
      `}</style>

      {/* ID Card Display Center layout */}
      <div className="md:col-span-2">
        {selectedStudent ? (
          <div className="space-y-6">
            <div className="flex justify-end no-print">
              <Button onClick={triggerPrint} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 px-6 font-bold text-xs shadow">
                <Printer className="w-4 h-4" />
                <span>Print ID pocket Card</span>
              </Button>
            </div>

            {/* Duo Face ID layout design, formatted natively as card box size */}
            <div id="printable-area" className="print-container flex flex-col md:flex-row gap-6 justify-center items-center py-4">
              
              {/* CARD FACE A: FRONT */}
              <div className="w-[55mm] h-[85mm] bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 rounded-xl overflow-hidden border border-indigo-500 flex flex-col justify-between p-3 shadow-xl relative text-white">
                {/* Decorative graphic nodes */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-200/5 rounded-full blur-lg"></div>

                {/* Header */}
                <div className="text-center border-b border-indigo-500/40 pb-1.5 shrink-0 z-10 flex flex-col items-center justify-center gap-0.5">
                  {(schools.find(school => school.id === currentUser?.schoolId)?.logo) && (
                    <img src={schools.find(school => school.id === currentUser?.schoolId)?.logo} alt="Logo" className="w-8 h-8 object-contain mb-0.5" />
                  )}
                  <h1 className="text-[10px] font-black tracking-wider uppercase text-indigo-100">{schools.find(school => school.id === currentUser?.schoolId)?.name || 'SCHOOL NAME'}</h1>
                  <p className="text-[5px] text-indigo-300 uppercase tracking-[0.25em]">{schools.find(school => school.id === currentUser?.schoolId)?.udiseCode ? `UDISE: ${schools.find(school => school.id === currentUser?.schoolId)?.udiseCode}` : 'UP Board Higher Secondary Code-385'}</p>
                </div>

                {/* Profile Core */}
                <div className="flex flex-col items-center justify-center space-y-1.5 z-10 flex-1 my-2">
                  {selectedStudent.docStudentPhoto || selectedStudent.photoUrl ? (
                    <img src={selectedStudent.docStudentPhoto || selectedStudent.photoUrl} alt="Photo" className="w-[62px] h-[75px] object-cover border-2 border-indigo-400 rounded-lg shadow-md" />
                  ) : (
                    <div className="w-[62px] h-[75px] bg-slate-800 rounded-lg border-2 border-dashed border-indigo-500/40 flex items-center justify-center text-[8px] text-indigo-300 font-medium">Pic</div>
                  )}

                  <div className="text-center space-y-0.5">
                    <h2 className="text-[11px] font-black text-white px-1 leading-tight uppercase truncate max-w-[170px]">{selectedStudent.name}</h2>
                    <p className="text-[7.5px] bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded px-2 py-0.5 inline-block font-black uppercase tracking-wider">{selectedStudent.grade}</p>
                  </div>
                </div>

                {/* Fast Details */}
                <div className="text-[8px] space-y-1 bg-white/5 border border-white/10 rounded-lg p-2 font-medium shrink-0 z-10 text-slate-200">
                  <div className="flex justify-between"><span>SR Number:</span> <span className="font-bold text-white font-mono">{selectedStudent.srNo || 'N/A'}</span></div>
                  <div className="flex justify-between"><span>Roll Number:</span> <span className="font-bold text-teal-400 font-mono">{selectedStudent.rollNo}</span></div>
                  <div className="flex justify-between"><span>Blood Group:</span> <span className="font-bold text-rose-400">{selectedStudent.bloodGroup || 'O+'}</span></div>
                </div>

                {/* Footer badge */}
                <p className="text-[6px] text-center text-indigo-300 uppercase tracking-widest font-black shrink-0 mt-1">STUDENT IDENTITY CARD</p>
              </div>

              {/* CARD FACE B: BACK */}
              <div className="w-[55mm] h-[85mm] bg-white rounded-xl overflow-hidden border border-slate-300 flex flex-col justify-between p-3 shadow-xl relative text-slate-800">
                {/* Header back */}
                <div className="text-center border-b pb-1.5 shrink-0">
                  <span className="text-[5px] uppercase font-bold text-slate-400 block tracking-widest">institution address & rules</span>
                  <p className="text-[7px] font-black text-indigo-900 uppercase">{schools.find(school => school.id === currentUser?.schoolId)?.name || 'SCHOOL NAME'}</p>
                </div>

                {/* Personal coordinate details */}
                <div className="space-y-1.5 text-[7px] py-2 flex-1 flex flex-col justify-center">
                  <p><span className="font-extrabold text-slate-400 uppercase w-16 inline-block">Father Name:</span> <span className="font-bold text-slate-700">{selectedStudent.fatherName || 'N/A'}</span> {selectedStudent.fatherNameHindi && <span className="ml-1 font-semibold text-slate-850 font-sans">({selectedStudent.fatherNameHindi})</span>}</p>
                  <p><span className="font-extrabold text-slate-400 uppercase w-16 inline-block">Mother Name:</span> <span className="font-bold text-slate-700">{selectedStudent.motherName || 'N/A'}</span> {selectedStudent.motherNameHindi && <span className="ml-1 font-semibold text-slate-850 font-sans">({selectedStudent.motherNameHindi})</span>}</p>
                  <p><span className="font-extrabold text-slate-400 uppercase w-16 inline-block">Emerg Contact:</span> <span className="font-bold text-slate-900 font-mono">{selectedStudent.mobile || 'N/A'}</span></p>
                  
                  <div className="pt-1.5 border-t border-slate-100 flex flex-col">
                    <span className="font-extrabold text-slate-400 uppercase text-[6px]">Residential Address:</span>
                    <p className="leading-tight text-slate-500 italic mt-0.5">
                      {selectedStudent.presentVillageMohalla || selectedStudent.address || 'N/A'}, 
                      P.O: {selectedStudent.presentPostOffice || 'N/A'}, 
                      Dist: {selectedStudent.presentDistrict || 'Prayagraj'} ({selectedStudent.presentPinCode || '211001'})
                    </p>
                  </div>
                </div>

                {/* RFID and barcode placeholders */}
                <div className="space-y-2 shrink-0 border-t border-slate-100 pt-2 text-center flex flex-col items-center">
                  {/* Fake Barcode illustration representation */}
                  <div className="w-32 h-6 bg-slate-100 border border-slate-200 rounded flex flex-col justify-between p-0.5 relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full flex gap-[2px] overflow-hidden opacity-80">
                      {/* Generates faux stripes */}
                      {Array.from({length: 22}).map((_, i) => (
                        <div key={i} className="bg-slate-800" style={{
                          width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px',
                          height: '100%'
                        }}></div>
                      ))}
                    </div>
                    <span className="font-mono text-[5px] text-slate-600 tracking-[0.15em] uppercase font-bold absolute bottom-0">{selectedStudent.attendanceId || 'ATT1004'}</span>
                  </div>

                  {/* Sign Seal approval */}
                  <div className="w-full flex justify-between items-center text-[5px] text-slate-400 font-extrabold uppercase mt-1">
                    <span>RFID SMART ID CARD</span>
                    <div className="text-center">
                      <div className="w-12 border-b border-slate-300 mb-0.5"></div>
                      <span>Principal Sign</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 border border-dashed rounded bg-slate-50 text-slate-400">
            <CreditCard className="w-12 h-12 mb-2 text-slate-350" />
            <p className="text-sm font-semibold">No ID Card Selected</p>
            <p className="text-xs">Select a student from the sidebar registrar database to generate the double-sided pocket ID badge layout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
