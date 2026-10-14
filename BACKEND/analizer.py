#Analyzer.py
def analyse_resume(resume_text,jd_text):
    resume_text=resume_text.lower()
    jd_text=jd_text.lower()
    skills = [
            "python",
            "sql",
            "react",
            "fastapi",
            "docker"
        ]

    matched_skills = []
    unmatched_skills=[]
    suggestion=[]
    matched_score=[]
    for i in skills:
        if i in resume_text and i in jd_text:
            matched_skills.append(i)
            if skills:
                matched_score=round(len(matched_skills)/len(skills)*100,2)
        else:
            unmatched_skills.append(i)
            suggestion.append(f"Try learning {i} for this profile add {i} to your resume")
            

    return {
        "matched_skills": matched_skills,
        "unmatched_skills": unmatched_skills,
        "suggestion":suggestion,
        "matched_score":matched_score
    }