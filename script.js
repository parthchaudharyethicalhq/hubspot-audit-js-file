document.addEventListener('DOMContentLoaded', function () {
    const initialSubmit = document.querySelector('[hsa-final-submit="Yes"]');
    const fianlSubmit = document.querySelector('[hsa-final-submit="final"]');
    const followUpQuestionContainer = document.getElementById('audit-followup');
    const followUpAnswers = document.getElementById('hsa-followup-ans');
    const recommendationContainer = document.getElementById('audit-recommendations');
    let hsaUserInfo;
    let hsaInitialUserAnswers;
    let mainPrompt;
    let finalPrompt;

    // On Initial Submit
    initialSubmit.addEventListener('click', async function (e) {
        e.preventDefault();

        hsaUserInfo = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            companyUrl: document.getElementById('company-url').value,
            email: document.getElementById('email-address').value
        };

        hsaInitialUserAnswers = {
            marketingHub: document.querySelector('input[name="Marketing-Hub"]:checked')?.value || '',
            salesHub: document.querySelector('input[name="Sales-Hub"]:checked')?.value || '',
            serviceHub: document.querySelector('input[name="Service-Hub"]:checked')?.value || '',
            cmsHub: document.querySelector('input[name="CMS-Hub"]:checked')?.value || '',
            opsHub: document.querySelector('input[name="Operations-Hub"]:checked')?.value || '',
            goals: Array.from(document.getElementById('goal').selectedOptions).map(opt => opt.value),
            goalsOther: document.getElementById('goal-others').value,
            improvements: Array.from(document.getElementById('improvement').selectedOptions).map(opt => opt.value),
            workflowCount: document.querySelector('input[name="workflows"]:checked')?.value || '',
            segmentation: Array.from(document.getElementById('Segmentation').selectedOptions).map(opt => opt.value),
            segmentationOther: document.getElementById('segmentation-other').value,
            underusedFeatures: Array.from(document.getElementById('features').selectedOptions).map(opt => opt.value),
            dataQuality: Array.from(document.getElementById('data-quality').selectedOptions).map(opt => opt.value),
            integrations: Array.from(document.getElementById('integrations').selectedOptions).map(opt => opt.value),
            integrationsOther: document.getElementById('integrations-other').value,
            mainChallenge: document.getElementById('challenge').value
        };

        mainPrompt = `
            You are an expert HubSpot consultant with extensive experience in optimizing HubSpot implementations. You're analyzing information from a user who has filled out an initial form about their HubSpot usage.

            Based on their responses, your task is to:
            1. Identify gaps or areas that need more information
            2. Generate 3-5 personalized, highly relevant follow-up questions
            3. Ensure the questions are specific to their situation and will help you provide better recommendations

            Here's the user's information:

            Name: ${hsaUserInfo.firstName} ${hsaUserInfo.lastName}
            Company: ${hsaUserInfo.companyUrl}
            Email: ${hsaUserInfo.email}

            HubSpot Tools in Use:
            - Marketing Hub: ${hsaInitialUserAnswers.marketingHub}
            - Sales Hub: ${hsaInitialUserAnswers.salesHub}
            - Service Hub: ${hsaInitialUserAnswers.serviceHub}
            - CMS Hub: ${hsaInitialUserAnswers.cmsHub}
            - Operations Hub: ${hsaInitialUserAnswers.opsHub}

            Primary Goals with HubSpot:
            ${hsaInitialUserAnswers.goals.join(', ')} ${hsaInitialUserAnswers.goalsOther ? `(Other: ${hsaInitialUserAnswers.goalsOther})` : ''}

            Areas Looking to Improve:
            ${hsaInitialUserAnswers.improvements.join(', ')}

            Number of Active Workflows:
            ${hsaInitialUserAnswers.workflowCount}

            Contact Segmentation Methods:
            ${hsaInitialUserAnswers.segmentation.join(', ')} ${hsaInitialUserAnswers.segmentationOther ? `(Other: ${hsaInitialUserAnswers.segmentationOther})` : ''}

            Underutilized HubSpot Features:
            ${hsaInitialUserAnswers.underusedFeatures.join(', ')}

            Contact Data Quality:
            ${hsaInitialUserAnswers.dataQuality.join(', ')}

            Third-party Integrations:
            ${hsaInitialUserAnswers.integrations.join(', ')} ${hsaInitialUserAnswers.integrationsOther ? `(Other: ${hsaInitialUserAnswers.integrationsOther})` : ''}

            Biggest Challenge:
            ${hsaInitialUserAnswers.mainChallenge}

            Based on this information, generate 3-5 follow-up questions that will help you provide better, more specific recommendations. Format your response as follows:

            "Based on your HubSpot setup, I'd like to ask a few follow-up questions to provide you with the most relevant recommendations:

            1. [Question 1]
            2. [Question 2]
            3. [Question 3]
            4. [Question 4 - if needed]
            5. [Question 5 - if needed]

            Your answers will help me provide specific, actionable recommendations to improve your HubSpot implementation."

            Important guidelines:
            - Questions should be specific and directly related to the information provided
            - Focus on areas where more detail would help provide better recommendations
            - Adapt questions based on their specific tools, goals, and challenges
            - Ask open-ended questions that can't be answered with yes/no
            - Avoid generic questions that could apply to any HubSpot user
            - Provide response in HTML format.
        `;

        try {
            const response = await fetch("https://hook.eu2.make.com/yopro1oexx44tfxgj0w7x8zdov6y6t6p", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    step: "initial",
                    prompt: mainPrompt,
                    userInfo: hsaUserInfo,
                    userAnswers: hsaInitialUserAnswers
                })
            });

            if (!response.ok) throw new Error('Failed to get a response from Make.com webhook');

            const html = await response.text();

            followUpQuestionContainer.innerHTML = html;

            // Hide loading div - Show followup screen
            $('.hsa-placeholder-loader').addClass('d-none');
            $('.hsa-follow-up').removeClass('d-none');

        } catch (error) {
            console.error('Error:', error);
            recommendationContainer.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
        }
    });

    // On Final Submit
    fianlSubmit.addEventListener('click', async function (e) {
        e.preventDefault();

        const value = followUpAnswers.value.trim();

        if (!value) {
            // Show error (e.g., add error class or message)
            alert('Please fill out the follow-up field before submitting.');
            return;
        }

        // hide all Steps show final answer step
        $('[class^="hsa-step-"]').addClass('d-none');
        $('.hsa-step-4, .hsa-placeholder-loader').removeClass('d-none');

        finalPrompt = `
            You are an expert HubSpot consultant specializing in optimization and implementation. You've received comprehensive information about a user's HubSpot setup, including their initial responses and answers to follow-up questions.

            Your task is to:
            1. Analyze all information to identify optimization opportunities
            2. Generate 7-10 specific, actionable recommendations
            3. Prioritize these recommendations using an Impact-Confidence-Ease analysis
            4. Present them in order from highest to lowest priority

            Here's the user's complete information:

            Initial Form Information:
            -------------
            Name: ${hsaUserInfo.firstName} ${hsaUserInfo.lastName}
            Company: ${hsaUserInfo.companyUrl}
            Email: ${hsaUserInfo.email}

            HubSpot Tools in Use:
            - Marketing Hub: ${hsaInitialUserAnswers.marketingHub}
            - Sales Hub: ${hsaInitialUserAnswers.salesHub}
            - Service Hub: ${hsaInitialUserAnswers.serviceHub}
            - CMS Hub: ${hsaInitialUserAnswers.cmsHub}
            - Operations Hub: ${hsaInitialUserAnswers.opsHub}

            Primary Goals with HubSpot:
            ${hsaInitialUserAnswers.goals.join(', ')} ${hsaInitialUserAnswers.goalsOther ? `(Other: ${hsaInitialUserAnswers.goalsOther})` : ''}

            Areas Looking to Improve:
            ${hsaInitialUserAnswers.improvements.join(', ')}

            Number of Active Workflows:
            ${hsaInitialUserAnswers.workflowCount}

            Contact Segmentation Methods:
            ${hsaInitialUserAnswers.segmentation.join(', ')} ${hsaInitialUserAnswers.segmentationOther ? `(Other: ${hsaInitialUserAnswers.segmentationOther})` : ''}

            Underutilized HubSpot Features:
            ${hsaInitialUserAnswers.underusedFeatures.join(', ')}

            Contact Data Quality:
            ${hsaInitialUserAnswers.dataQuality.join(', ')}

            Third-party Integrations:
            ${hsaInitialUserAnswers.integrations.join(', ')} ${hsaInitialUserAnswers.integrationsOther ? `(Other: ${hsaInitialUserAnswers.integrationsOther})` : ''}

            Biggest Challenge:
            ${hsaInitialUserAnswers.mainChallenge}

            Follow-up Questions and Answers:
            -------------
            Questions: ${followUpQuestionContainer.innerHTML}
            Answers: ${followUpAnswers.value}

            Format your response using the following structure:

            "# HubSpot Audit Results for ${hsaUserInfo.firstName} at ${hsaUserInfo.companyUrl}

            ## Current Setup Overview
            [Provide a concise 3-4 sentence summary of their current HubSpot setup, goals, and key challenges based on all information provided]

            ## Recommended Optimizations

            Based on your HubSpot configuration and goals, here are my prioritized recommendations:

            ### 1. [First Recommendation - Highest Priority]
            **What**: [Clear description of what should be implemented or changed]
            **Why**: [Explanation of benefits and how it addresses their challenges]
            **How**: [Brief implementation guidance with 2-3 specific steps]

            ### 2. [Second Recommendation]
            **What**: [Clear description of what should be implemented or changed]
            **Why**: [Explanation of benefits and how it addresses their challenges]
            **How**: [Brief implementation guidance with 2-3 specific steps]

            [Continue with recommendations 3-10, following the same format]

            ## Next Steps
            To discuss these recommendations in detail and receive personalized implementation guidance, schedule a free 30-minute consultation with our HubSpot experts.

            [Consultation CTA]

            Important guidelines:
            - Each recommendation should be specific, actionable, and tailored to their situation
            - Focus recommendations on their stated goals and challenges
            - Include a mix of quick wins and strategic improvements
            - For the Impact-Confidence-Ease analysis, prioritize recommendations that would have high impact, high confidence in success, and reasonable ease of implementation
            - Ensure recommendations span different aspects of HubSpot (data management, automation, analytics, etc.)
            - Do not mention the actual ICE scores in your response
            - Recommendations should demonstrate expertise and provide value even if they don't become a client

            Pleaze send response in HTML format.
        `;

        try {
            const response = await fetch("https://hook.eu2.make.com/yopro1oexx44tfxgj0w7x8zdov6y6t6p", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    step: "followup",
                    prompt: finalPrompt,
                    userInfo: hsaUserInfo,
                    userAnswers: hsaInitialUserAnswers
                })
            });

            if (!response.ok) throw new Error('Failed to get a response from Make.com webhook');

            const html = await response.text();

            recommendationContainer.innerHTML = html;

            // Hide loading div - Show followup screen
            $('.hsa-placeholder-loader').addClass('d-none');
            $('.hsa-recommendation').removeClass('d-none');

        } catch (error) {
            console.error('Error:', error);
            recommendationContainer.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
        }

    });

    /* -------------------
    Handle Step navigation logic
    ---------------------- */
    function handleStepsNavigation() {
        const $steps = $('[class^="hsa-step-"]');
        const $modal = $('.hsa-modal-wrap');

        $steps.not('.hsa-step-1').addClass('d-none');

        $('[step-go-to]').on('click', async function () {
            const targetStep = $(this).attr('step-go-to');

            if (targetStep === '2') {
                const firstName = $('#first-name').val().trim();
                const lastName = $('#last-name').val().trim();
                const companyUrl = $('#company-url').val().trim();
                const email = $('#email-address').val().trim();

                let hasError = false;
                $('.form-error').remove(); // Clear any existing errors

                // First Name check
                if (!firstName) {
                    $('#first-name').after('<div class="form-error">First name is required.</div>');
                    hasError = true;
                }

                // Last Name check
                if (!lastName) {
                    $('#last-name').after('<div class="form-error">Last name is required.</div>');
                    hasError = true;
                }

                // URL check (basic pattern)
                const urlPattern = /^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+$/i;
                if (!urlPattern.test(companyUrl)) {
                    $('#company-url').after('<div class="form-error">Enter a valid company URL like www.example.com</div>');
                    hasError = true;
                }

                // Email format check
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    $('#email-address').after('<div class="form-error">Invalid email format.</div>');
                    hasError = true;
                }

                if (hasError) return;

                // ✅ Emailable API verification
                try {
                    const res = await fetch(`https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=live_098d50d0e1545add1658`);
                    const data = await res.json();

                    if (data.state !== 'deliverable') {
                        $('#email-address').after('<div class="form-error">Email is not deliverable.</div>');
                        return;
                    }

                    if (data.free) {
                        $('#email-address').after('<div class="form-error">Free email addresses (like Gmail, Yahoo) are not allowed. Use your business email.</div>');
                        return;
                    }

                    if (data.disposable) {
                        $('#email-address').after('<div class="form-error">Disposable email addresses are not allowed.</div>');
                        return;
                    }

                } catch (err) {
                    $('#email-address').after('<div class="form-error">Failed to verify email address. Try again later.</div>');
                    return;
                }
            }

            // ✅ If everything passed
            if (targetStep === 'Submit') {
                $modal.removeClass('d-none');
            } else {
                $steps.addClass('d-none');
                $(`.hsa-step-${targetStep}`).removeClass('d-none');

                const $section = $('.hsa-section');
                if ($section.length) {
                    $('html, body').animate({
                        scrollTop: $section.offset().top - 60
                    }, 800);
                }
            }
        });

        // ✅ Modal "Yes"/"No" handling
        $('[hsa-final-submit]').on('click', function () {
            const action = $(this).attr('hsa-final-submit');
            if (action === 'Yes') {
                $modal.addClass('d-none');
                $steps.addClass('d-none');
                $('.hsa-step-3').removeClass('d-none');
            } else if (action === 'No') {
                $modal.addClass('d-none');
            }
        });
    }

    //Handle Modal
    function handleModalConfirmation() {
        const $modal = $('.hsa-modal-wrap');
        const $step2 = $('.hsa-step-2');
        const $step3 = $('.hsa-step-3');

        // Handle "Yes" click
        $('[hsa-final-submit="Yes"]').on('click', function () {
            $modal.addClass('d-none');    // Hide modal
            $step2.addClass('d-none');    // Hide Step 2
            $step3.removeClass('d-none'); // Show Step 3

            //Scroll top to section
            $('html, body').animate({
                scrollTop: $('.hsa-section').offset().top - 60
            }, 800);
        });

        // Handle "No" click
        $('[hsa-final-submit="No"]').on('click', function () {
            $modal.addClass('d-none');    // Just hide modal
        });
    }

    handleStepsNavigation();
    handleModalConfirmation();
});