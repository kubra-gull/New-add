import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Compass,
  CheckCircle,
  ThumbsUp,
  MapPin,
  Flame,
  X,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { TestimonialRecord } from "../types";
import { ALL_PROVINCES } from "../data/pakistanLocations";

export function TestimonialsView() {
  const [reviews, setReviews] = useState<TestimonialRecord[]>(() => mockDb.getTestimonials());
  
  // Testimonial Form triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Parent / Mother");
  const [formRating, setFormRating] = useState<number>(5);
  const [formText, setFormText] = useState("");
  const [formProv, setFormProv] = useState(ALL_PROVINCES[0]);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Stats aggregate calculations
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const regionalBreakdown = useMemo(() => {
    const counts: { [p: string]: number } = {};
    ALL_PROVINCES.forEach((p) => { counts[p] = 0; });
    
    reviews.forEach((r) => {
      if (counts[r.province] !== undefined) {
        counts[r.province]++;
      } else {
        counts[r.province] = 1;
      }
    });

    return counts;
  }, [reviews]);

  // Handle addition
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formText || !formRating) {
      alert("Please complete name, star rating and feedback text.");
      return;
    }

    const newReview: TestimonialRecord = {
      id: `TEST-${Date.now().toString().substr(9)}`,
      fullName: formName,
      role: formRole,
      rating: Number(formRating),
      feedback: formText,
      province: formProv,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    mockDb.setTestimonials(updated);
    setIsFormOpen(false);

    // Clear forms
    setFormName("");
    setFormRole("Parent / Mother");
    setFormRating(5);
    setFormText("");

    setFormSuccess("Thank you for sharing your experience! Your testimonial has been securely catalogued.");
    setTimeout(() => setFormSuccess(null), 3000);

    logOperation(
      "ADD_TESTIMONIAL",
      `Parent/Worker ${formName} filed the NIH satisfaction review with ${formRating} stars from ${formProv}.`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Upper informational bar */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-primary" /> CITIZENS COMPLIANCE & ADVOCACY ARENA
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real experiences, campaign ratings, and feedbacks from parents and vaccinator staff on the field across Pakistan
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((val) => !val)}
          className="p-2 px-4 bg-primary hover:bg-primary-hover text-slate-905 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Share Success Story
        </button>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {formSuccess}
        </div>
      )}

      {/* Main Grid: Aggregate feedback widgets + Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Aggregates list */}
        <div className="space-y-6">
          
          {/* Average Rating Block */}
          <div className="bg-zinc-900 text-white p-5 rounded-xl text-center border-b-4 border-primary shadow-xs">
            <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
              PUBLIC ADVOCACY MEAN SCORE
            </span>
            <h2 className="text-5xl font-mono font-extrabold tracking-tighter text-white mt-2">
              {avgRating} <span className="text-sm text-slate-400">/ 5.0</span>
            </h2>
            
            {/* Stars Row */}
            <div className="flex justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(avgRating) ? "fill-primary text-primary" : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
              Based on live synchronized polls of district immunization hubs of Pakistan
            </p>
          </div>

          {/* Regional Review distribution */}
          <div className="bg-white dark:bg-dark-card border border-slate-205 dark:border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1">
              <Compass className="w-4.5 h-4.5 text-primary" /> CITIZENS ENGAGEMENT BY REGIONS
            </h4>
            
            <div className="space-y-3 text-xs">
              {Object.entries(regionalBreakdown).map(([prov, count]) => (
                <div key={prov} className="flex justify-between items-center text-slate-600 dark:text-slate-350 border-b dark:border-slate-800 pb-1.5">
                  <span className="font-medium">{prov}</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-850 p-1 px-2.5 rounded font-bold text-primary">
                    {count} Review(s)
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Middle and Right: Submissions + Reviews Stream Layout */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Inline Form Add Testimonial */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddSubmit}
                className="bg-white dark:bg-dark-card border border-slate-250 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-slate-850 dark:text-white">
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-primary" /> Register Campaign testimonial
                  </h3>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 text-xs hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-450 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Uzma Shah / Dr. Ali"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2 text-zinc-800 dark:text-zinc-150 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-450 mb-1">Affiliation / Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Health Worker, Mumtazabad / Mother of Zainab"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2 text-zinc-800 dark:text-zinc-150 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-450 mb-1">Your Region / Province *</label>
                    <select
                      value={formProv}
                      onChange={(e) => setFormProv(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2 text-zinc-705 rounded dark:text-zinc-150"
                    >
                      {ALL_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-slate-450 mb-1">Satisfactory Star rating *</label>
                    <div className="flex gap-1.5 items-center py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <motion.button
                          type="button"
                          key={s}
                          onClick={() => setFormRating(s)}
                          whileHover={{ scale: 1.15 }}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 select-none ${
                              s <= formRating ? "fill-primary text-primary" : "text-slate-300"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-450 mb-1">Your Written Feedback / Success Story *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide your experience, suggestions, or comments about Cold Chain services, mobile Lady Health Worker sweeps, or SMS reminders on the platform..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2.5 text-zinc-800 dark:text-zinc-150 rounded"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2 border-t dark:border-slate-850">
                  <button type="submit" className="p-2 px-5 bg-secondary text-white font-bold rounded-lg text-xs">
                    Confirm Submission
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews list layout */}
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-805 p-5 rounded-2xl relative shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= r.rating ? "fill-primary text-primary" : "text-slate-200 dark:text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded font-mono text-slate-450 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> {r.province}
                    </span>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed italic">
                    "{r.feedback}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-extrabold text-slate-800 dark:text-zinc-200">{r.fullName}</h5>
                    <p className="text-[10px] text-zinc-450 mt-0.5 leading-none">{r.role}</p>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
