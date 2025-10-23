import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/layout/Footer';

// Blog editor preview texts
const TYPEWRITER_TEXTS = [
  "# Welcome to BlogsIO\nStart writing your thoughts, share your stories, and connect with readers around the world.\n\n## Features\n- Rich text editor\n- Live preview\n- Easy publishing",
  "# Getting Started Guide\n1. Create your account\n2. Choose a beautiful theme\n3. Start writing your first post\n4. Publish and share\n\nIt's that simple!",
  "# Why Choose BlogsIO?\n1. Beautiful, responsive design\n2. Powerful editor tools\n3. Global audience reach\n4. Analytics dashboard\n\nJoin thousands of writers today."
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [typewriterText, setTypewriterText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Function to render markdown-like text properly
  const renderTypewriterContent = (text, showCursorInline = false) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const isLastLine = index === lines.length - 1;
      const cursor = showCursorInline && isLastLine ? <span className="typewriter-cursor text-accent">|</span> : null;
      
      if (line.startsWith('# ')) {
        return (
          <div key={index} className="font-bold text-accent text-base mb-2">
            {line.substring(2)}{cursor}
          </div>
        );
      } else if (line.startsWith('## ')) {
        return (
          <div key={index} className="font-semibold text-accent text-sm mb-1">
            {line.substring(3)}{cursor}
          </div>
        );
      } else if (line.startsWith('- ')) {
        return (
          <div key={index} className="text-text-secondary text-xs ml-2 mb-1">
            • {line.substring(2)}{cursor}
          </div>
        );
      } else if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+)\. (.+)/);
        if (match) {
          return (
            <div key={index} className="text-text-secondary text-xs ml-2 mb-1">
              {match[1]}. {match[2]}{cursor}
            </div>
          );
        }
      } else if (line.trim() === '') {
        return <div key={index} className="h-2">{cursor}</div>;
      } else {
        return (
          <div key={index} className="text-text-secondary text-xs mb-1">
            {line}{cursor}
          </div>
        );
      }
    });
  };



  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated()) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Typewriter effect
  useEffect(() => {
    const currentText = TYPEWRITER_TEXTS[currentTextIndex];
    const speed = isDeleting ? 30 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (typewriterText.length < currentText.length) {
          setTypewriterText(currentText.substring(0, typewriterText.length + 1));
          setShowCursor(true);
        } else {
          // Finished typing, hide cursor briefly then start deleting
          setShowCursor(false);
          setTimeout(() => {
            setShowCursor(true);
            setIsDeleting(true);
          }, 1500);
        }
      } else {
        // Deleting
        if (typewriterText.length > 0) {
          setTypewriterText(currentText.substring(0, typewriterText.length - 1));
          setShowCursor(true);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setShowCursor(true);
          setCurrentTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [typewriterText, currentTextIndex, isDeleting]);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Rich Text Editor",
      description: "Create beautiful blog posts with our intuitive rich text editor featuring formatting, images, and more."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Role-Based Access",
      description: "Secure content management with admin, author, and reader roles to control who can create and edit content."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Interactive Comments",
      description: "Engage your audience with a robust commenting system that fosters community discussion."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 002 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics Dashboard",
      description: "Track your blog's performance with detailed statistics and insights about your content and audience."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Smart Search",
      description: "Help readers find content quickly with our powerful search functionality across all your posts."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mobile Responsive",
      description: "Your blog looks perfect on all devices with our fully responsive design that adapts to any screen."
    }
  ];

  const stats = [
    {
      number: "100%",
      label: "Free to Use",
      description: "Complete blogging platform at no cost"
    },
    {
      number: "5min",
      label: "Quick Setup",
      description: "Get started with your first blog post"
    },
    {
      number: "24/7",
      label: "Always Available",
      description: "Write whenever inspiration strikes"
    }
  ];

  const implementedFeatures = [
    {
      title: "Rich Text Editor",
      description: "Full-featured markdown editor with live preview and formatting tools",
      tech: "React + Markdown",
      color: "from-blue-500 to-purple-600",
      icon: "M",
      shadowColor: "shadow-blue-500/25"
    },
    {
      title: "Authentication System", 
      description: "Secure login/register with role-based access control",
      tech: "JWT + Context API",
      color: "from-emerald-500 to-teal-600",
      icon: "A",
      shadowColor: "shadow-emerald-500/25"
    },
    {
      title: "Interactive Comments",
      description: "Real-time commenting system with nested replies",
      tech: "React Hooks",
      color: "from-orange-500 to-red-600",
      icon: "C",
      shadowColor: "shadow-orange-500/25"
    },
    {
      title: "Responsive Design",
      description: "Beautiful UI that works perfectly on all devices",
      tech: "Tailwind CSS",
      color: "from-pink-500 to-rose-600",
      icon: "R",
      shadowColor: "shadow-pink-500/25"
    },
    {
      title: "Dark/Light Theme",
      description: "Seamless theme switching with system preference detection",
      tech: "CSS Variables",
      color: "from-indigo-500 to-purple-600",
      icon: "T",
      shadowColor: "shadow-indigo-500/25"
    }
  ];

  const [currentFeatureIndex, setCurrentFeatureIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % implementedFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [implementedFeatures.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"></div>
        
        {/* Flowing Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="transform transition-all duration-1000 translate-x-0 opacity-100">
              <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                New Platform Launch
              </div>
              
              <h1 className="font-sans text-4xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                <span className="hero-gradient-text">
                  Create. Share.
                </span>
                <br />
                <span className="hero-gradient-text">
                  Inspire.
                </span>
              </h1>
              
              <p className="font-sans font-light text-2xl md:text-3xl text-text-secondary mb-8 leading-relaxed">
                Where words bloom like flowers in the garden of thoughts
              </p>
              
              <p className="font-sans font-extralight text-xl text-text-secondary/80 mb-10 max-w-lg">
                The most elegant and powerful blog management platform designed for creators who value beautiful design and seamless functionality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="group relative overflow-hidden bg-accent text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-accent"
                  style={{
                    backgroundColor: 'var(--color-accent)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                  }}
                >
                  <span className="relative z-20 flex items-center text-white">
                    Start Writing Today
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/login"
                  className="group border-2 border-border-color hover:border-accent text-text-primary hover:text-accent px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 bg-background hover:bg-accent/5"
                >
                  <span className="flex items-center">
                    Sign In
                    <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column - Interactive Preview */}
            <div className="transform transition-all duration-1000 delay-300 translate-x-0 opacity-100">
              <div className="relative">
                {/* Mock Browser Window */}
                <div className="bg-background border border-border-color rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Browser Header */}
                  <div className="bg-accent/5 border-b border-border-color px-6 py-4 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-background border border-border-color rounded-lg px-4 py-2 font-light text-sm text-text-secondary max-w-xs mx-auto">
                        blogsio.com
                      </div>
                    </div>
                  </div>
                  
                  {/* Typewriter Content */}
                  <div className="p-6 h-64 overflow-hidden bg-background/50">
                    <div className="typewriter-background h-full">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-color/30">
                        <h3 className="font-sans text-sm font-medium text-text-secondary">editor.md</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="font-sans font-light text-xs text-text-secondary">Live Preview</span>
                        </div>
                      </div>
                      <div className="font-sans text-sm text-text-primary leading-relaxed overflow-hidden">
                        <div className="typewriter-content">
                          <div className="space-y-1">
                            {renderTypewriterContent(typewriterText, showCursor)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-full shadow-lg animate-bounce-gentle">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-6 -left-4 bg-accent text-white p-3 rounded-full shadow-lg animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              <span className="bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Features for Every Creator
              </span>
            </h2>
            <p className="font-sans font-light text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your blog with elegance and efficiency.
            </p>
          </div>

          {/* Bento Box Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden bg-background border border-border-color rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                  index === 0 ? 'md:col-span-2' : 
                  index === 3 ? 'md:col-span-2' : 
                  'md:col-span-1'
                }`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/20 transform rotate-12 scale-150"></div>
                </div>
                
                {/* Icon Container */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-sans text-lg font-bold text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-sans font-light text-base text-text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Learn More Link */}
                  <div className="inline-flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Your <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Creative Journey</span> Starts Here
            </h2>
            <p className="font-sans font-thin text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
              A simple, elegant platform built to help you discover the joy of writing and sharing your thoughts.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-accent/5 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-border-color"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-medium text-text-primary mb-2">
                  {stat.label}
                </div>
                <div className="font-light text-lg text-text-secondary">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>

          {/* 3D Features Carousel */}
          <div className="relative perspective-1000">
            <h3 className="text-3xl font-bold text-center text-text-primary mb-12">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Features We've Actually Built
              </span>
            </h3>
            
            {/* 3D Cards Container */}
            <div className="relative h-96 flex items-center justify-center">
              {implementedFeatures.map((feature, index) => {
                const isActive = index === currentFeatureIndex;
                const isPrev = index === (currentFeatureIndex - 1 + implementedFeatures.length) % implementedFeatures.length;
                const isNext = index === (currentFeatureIndex + 1) % implementedFeatures.length;
                
                let cardClass = "absolute w-80 h-80 transition-all duration-700 ease-out cursor-pointer ";
                
                if (isActive) {
                  cardClass += "z-30 scale-110 transform-gpu";
                } else if (isPrev) {
                  cardClass += "z-20 scale-90 -translate-x-72 rotate-y-45 transform-gpu";
                } else if (isNext) {
                  cardClass += "z-20 scale-90 translate-x-72 -rotate-y-45 transform-gpu";
                } else {
                  cardClass += "z-10 scale-75 opacity-20 transform-gpu";
                }
                
                return (
                  <div
                    key={index}
                    className={cardClass}
                    onClick={() => setCurrentFeatureIndex(index)}
                  >
                    {/* 3D Card */}
                    <div className={`relative w-full h-full bg-gradient-to-br ${feature.color} rounded-3xl ${feature.shadowColor} shadow-2xl transform-gpu hover:scale-105 transition-all duration-300 group`}>
                      {/* Card Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold text-white border border-white/30">
                            {feature.icon}
                          </div>
                          <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                        </div>
                        
                        {/* Title */}
                        <div>
                          <h4 className="text-2xl font-bold mb-3 leading-tight">
                            {feature.title}
                          </h4>
                          <p className="font-light text-white/90 text-sm leading-relaxed mb-4">
                            {feature.description}
                          </p>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                            {feature.tech}
                          </div>
                          <div className="font-sans font-light text-xs opacity-75">LIVE</div>
                        </div>
                      </div>
                      
                      {/* 3D Edge Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-white/10 rounded-3xl"></div>
                      
                      {/* Hover Glow */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-12 space-x-8">
              <button
                onClick={() => setCurrentFeatureIndex((prev) => (prev - 1 + implementedFeatures.length) % implementedFeatures.length)}
                className="w-14 h-14 bg-background border-2 border-border-color rounded-2xl flex items-center justify-center text-text-primary hover:border-accent hover:text-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Dots Navigation */}
              <div className="flex space-x-3">
                {implementedFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatureIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentFeatureIndex 
                        ? 'bg-accent scale-125 shadow-lg' 
                        : 'bg-text-secondary/30 hover:bg-text-secondary/50 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentFeatureIndex((prev) => (prev + 1) % implementedFeatures.length)}
                className="w-14 h-14 bg-background border-2 border-border-color rounded-2xl flex items-center justify-center text-text-primary hover:border-accent hover:text-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="font-sans font-light text-xl md:text-2xl mb-8 text-white/90">
            Join BlogsIO today and transform the way you create and share your stories with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group px-10 py-4 bg-white text-accent font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="group-hover:mr-2 transition-all duration-300">Get Started Free</span>
              <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-accent transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Simple Background Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 border border-white/20 rounded-full"></div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;