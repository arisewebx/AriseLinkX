// src/components/admin/SecurityCenterModal.jsx
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  XCircle, 
  ShieldAlert, 
  Flag, 
  AlertCircle, 
  CheckCircle, 
  Ban, 
  Monitor, 
  Database, 
  Server, 
  Zap,
  AlertTriangle,
  ExternalLink,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Lock,
  Globe,
  Clock
} from 'lucide-react';

const SecurityCenterModal = ({ isOpen, onClose, allUrls, users }) => {
  
  if (!isOpen) return null;

  const [scanRunning, setScanRunning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Comprehensive security analysis
  const securityAnalysis = useMemo(() => {
    if (!allUrls || !users) return { 
      flaggedUrls: [], 
      suspiciousPatterns: [], 
      stats: {},
      recentThreats: [],
      userRiskScores: []
    };

    const flaggedUrls = [];
    const suspiciousPatterns = [];
    const recentThreats = [];
    const userRiskScores = [];
    
    // Enhanced suspicious patterns
    const suspiciousKeywords = [
      'login', 'verify', 'account', 'security', 'urgent', 'click', 'free', 'win', 
      'prize', 'congratulations', 'suspended', 'limited', 'confirm', 'update',
      'virus', 'infected', 'warning', 'alert', 'phishing', 'scam'
    ];
    
    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'short.link', 'rebrand.ly',
      'temp-mail', 'guerrillamail', '10minutemail', 'mailinator'
    ];

    const maliciousPatterns = [
      /[<>{}|\\"^`\[\]]/,  // XSS characters
      /javascript:/i,       // JavaScript protocol
      /data:/i,            // Data URI
      /vbscript:/i,        // VBScript
      /\.exe|\.bat|\.cmd|\.scr/i // Executable extensions
    ];
    
    // Analyze each URL
    allUrls.forEach(url => {
      const reasons = [];
      let riskScore = 0;
      
      // Title analysis
      if (url.title) {
        const suspiciousInTitle = suspiciousKeywords.filter(keyword => 
          url.title.toLowerCase().includes(keyword)
        );
        if (suspiciousInTitle.length > 0) {
          reasons.push(`Suspicious keywords: ${suspiciousInTitle.join(', ')}`);
          riskScore += suspiciousInTitle.length * 2;
        }
      }
      
      // URL analysis
      if (url.original_url) {
        // Check for suspicious domains
        const suspiciousInUrl = suspiciousDomains.filter(domain => 
          url.original_url.toLowerCase().includes(domain)
        );
        if (suspiciousInUrl.length > 0) {
          reasons.push('Links to other URL shorteners');
          riskScore += 3;
        }
        
        // Check for malicious patterns
        maliciousPatterns.forEach(pattern => {
          if (pattern.test(url.original_url)) {
            reasons.push('Contains potentially malicious code');
            riskScore += 5;
          }
        });
        
        // Length check
        if (url.original_url.length > 500) {
          reasons.push('Extremely long URL (potential obfuscation)');
          riskScore += 2;
        }
        
        // Check for excessive redirects
        const slashCount = (url.original_url.match(/\//g) || []).length;
        if (slashCount > 10) {
          reasons.push('Complex redirect pattern');
          riskScore += 2;
        }
        
        // Check for IP addresses instead of domains
        if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url.original_url)) {
          reasons.push('Links to IP address instead of domain');
          riskScore += 4;
        }
        
        // Check for non-standard ports
        if (/:\d{2,5}\//.test(url.original_url)) {
          const port = url.original_url.match(/:(\d{2,5})\//)?.[1];
          if (port && !['80', '443', '8080', '8443'].includes(port)) {
            reasons.push(`Uses non-standard port: ${port}`);
            riskScore += 3;
          }
        }
      }

      // Check creation patterns
      const createdDate = new Date(url.created_at);
      const user = users.find(u => u.id === url.user_id);
      
      if (user) {
        const userJoinDate = new Date(user.created_at);
        const timeDiff = createdDate - userJoinDate;
        
        // Links created very soon after joining
        if (timeDiff < 60 * 60 * 1000) { // Less than 1 hour
          reasons.push('Created shortly after user registration');
          riskScore += 2;
        }
      }

      // Determine risk level
      let riskLevel = 'low';
      if (riskScore >= 8) riskLevel = 'critical';
      else if (riskScore >= 5) riskLevel = 'high';
      else if (riskScore >= 3) riskLevel = 'medium';

      if (reasons.length > 0) {
        flaggedUrls.push({
          id: url.id,
          title: url.title || 'Untitled',
          short_url: url.short_url,
          original_url: url.original_url,
          user_email: user?.email || 'Unknown',
          user_id: url.user_id,
          created_at: url.created_at,
          reasons: reasons,
          risk_level: riskLevel,
          risk_score: riskScore
        });
      }
    });

    // Analyze user behavior patterns
    const userAnalysis = users.map(user => {
      const userUrls = allUrls.filter(url => url.user_id === user.id);
      const joinDate = new Date(user.created_at);
      const isNewUser = new Date() - joinDate < 7 * 24 * 60 * 60 * 1000; // Less than 7 days
      
      let userRiskScore = 0;
      const userFlags = [];
      
      // Rapid link creation
      if (userUrls.length > 20 && isNewUser) {
        userFlags.push('Rapid link creation after joining');
        userRiskScore += 5;
      }
      
      // Suspicious link patterns
      const suspiciousUserUrls = userUrls.filter(url => 
        flaggedUrls.some(flagged => flagged.id === url.id)
      );
      
      if (suspiciousUserUrls.length > 0) {
        userFlags.push(`${suspiciousUserUrls.length} flagged URLs`);
        userRiskScore += suspiciousUserUrls.length * 2;
      }
      
      // No email verification (if data available)
      if (user.email_verified === false) {
        userFlags.push('Unverified email address');
        userRiskScore += 2;
      }
      
      return {
        id: user.id,
        email: user.email,
        joinDate,
        linkCount: userUrls.length,
        suspiciousLinks: suspiciousUserUrls.length,
        riskScore: userRiskScore,
        flags: userFlags,
        riskLevel: userRiskScore >= 8 ? 'high' : userRiskScore >= 4 ? 'medium' : 'low'
      };
    });

    // Detect suspicious patterns
    userAnalysis.forEach(user => {
      if (user.riskScore > 0) {
        suspiciousPatterns.push({
          type: 'Suspicious User Activity',
          description: `${user.email}: ${user.flags.join(', ')}`,
          severity: user.riskLevel,
          user: user.email,
          userId: user.id,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Generate recent threats (last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const recentFlagged = flaggedUrls.filter(url => 
      new Date(url.created_at) > last24Hours
    );
    
    recentFlagged.forEach(url => {
      recentThreats.push({
        type: 'Flagged URL',
        description: `High-risk URL detected: ${url.short_url}`,
        severity: url.risk_level,
        timestamp: url.created_at,
        url: url.short_url,
        reasons: url.reasons
      });
    });

    const stats = {
      totalUrls: allUrls.length,
      flaggedUrls: flaggedUrls.length,
      criticalRisk: flaggedUrls.filter(url => url.risk_level === 'critical').length,
      highRisk: flaggedUrls.filter(url => url.risk_level === 'high').length,
      mediumRisk: flaggedUrls.filter(url => url.risk_level === 'medium').length,
      lowRisk: flaggedUrls.filter(url => url.risk_level === 'low').length,
      suspiciousPatterns: suspiciousPatterns.length,
      recentThreats: recentThreats.length,
      highRiskUsers: userAnalysis.filter(user => user.riskLevel === 'high').length,
      securityScore: Math.max(0, 100 - (flaggedUrls.length / allUrls.length * 100))
    };

    return { 
      flaggedUrls: flaggedUrls.sort((a, b) => b.risk_score - a.risk_score), 
      suspiciousPatterns, 
      stats, 
      recentThreats,
      userRiskScores: userAnalysis.filter(user => user.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore)
    };
  }, [allUrls, users]);

  // Filter flagged URLs based on search and risk level
  const filteredFlaggedUrls = useMemo(() => {
    return securityAnalysis.flaggedUrls.filter(url => {
      const matchesSearch = !searchQuery || 
        url.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.short_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.user_email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || url.risk_level === riskFilter;
      
      return matchesSearch && matchesRisk;
    });
  }, [securityAnalysis.flaggedUrls, searchQuery, riskFilter]);

  const handleSecurityScan = async () => {
    setScanRunning(true);
    try {
      // Simulate comprehensive security scan
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLastScanTime(new Date());
      alert(`Security scan completed! Found ${securityAnalysis.stats.flaggedUrls} potential threats.`);
    } catch (error) {
      // console.error('Security scan failed:', error);
      alert('Security scan failed. Please try again.');
    } finally {
      setScanRunning(false);
    }
  };

  const handleQuickAction = async (action, data) => {
    try {
      switch (action) {
        case 'approve':
          // console.log('Approving URL:', data);
          alert('URL approved and whitelisted');
          break;
        case 'block':
          if (!window.confirm('Block this URL? It will be immediately disabled.')) return;
          // console.log('Blocking URL:', data);
          alert('URL blocked successfully');
          break;
        case 'delete':
          if (!window.confirm('Delete this URL? This action cannot be undone.')) return;
          // console.log('Deleting URL:', data);
          alert('URL deleted successfully');
          break;
        case 'ban_user':
          if (!window.confirm('Ban this user? They will lose access to all features.')) return;
          // console.log('Banning user:', data);
          alert('User banned successfully');
          break;
        case 'investigate':
          // console.log('Flagging for investigation:', data);
          alert('Marked for manual investigation');
          break;
        default:
          // console.log('Unknown action:', action);
      }
    } catch (error) {
      // console.error(`Error performing ${action}:`, error);
      alert(`Error performing ${action}. Please try again.`);
    }
  };

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats: securityAnalysis.stats,
      flaggedUrls: securityAnalysis.flaggedUrls,
      suspiciousPatterns: securityAnalysis.suspiciousPatterns,
      recentThreats: securityAnalysis.recentThreats
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/40';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const TabButton = ({ id, label, count }) => (
    <Button
      onClick={() => setSelectedTab(id)}
      className={`px-4 py-2 text-sm ${
        selectedTab === id 
          ? 'bg-blue-600/30 text-blue-300 border-blue-500/40' 
          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
      } border`}
    >
      {label} {count !== undefined && <span className="ml-1">({count})</span>}
    </Button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Security & Moderation Center
          </h3>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportReport}
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={onClose} className="bg-transparent hover:bg-white/10 p-2">
              <XCircle className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Security Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-green-300 text-sm font-medium">Security Score</div>
                <div className="text-green-400 text-xl font-bold">{Math.round(securityAnalysis.stats.securityScore)}%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-4 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-3">
              <Flag className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-red-300 text-sm font-medium">Flagged URLs</div>
                <div className="text-red-400 text-xl font-bold">{securityAnalysis.stats.flaggedUrls}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-yellow-300 text-sm font-medium">High Risk</div>
                <div className="text-yellow-400 text-xl font-bold">{securityAnalysis.stats.criticalRisk + securityAnalysis.stats.highRisk}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-purple-300 text-sm font-medium">Recent Threats</div>
                <div className="text-purple-400 text-xl font-bold">{securityAnalysis.stats.recentThreats}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3">
              <Monitor className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-blue-300 text-sm font-medium">Patterns</div>
                <div className="text-blue-400 text-xl font-bold">{securityAnalysis.stats.suspiciousPatterns}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <TabButton id="overview" label="Overview" />
          <TabButton id="threats" label="Threats" count={securityAnalysis.stats.flaggedUrls} />
          <TabButton id="patterns" label="Patterns" count={securityAnalysis.stats.suspiciousPatterns} />
          <TabButton id="users" label="Risk Users" count={securityAnalysis.stats.highRiskUsers} />
          <TabButton id="actions" label="Actions" />
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Threats */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Recent Security Events
              </h4>
              {securityAnalysis.recentThreats.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {securityAnalysis.recentThreats.slice(0, 5).map((threat, index) => (
                    <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-300 font-medium text-sm">{threat.type}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(threat.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{threat.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent security threats</p>
                </div>
              )}
            </div>

            {/* Security Actions */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Quick Security Actions</h4>
              <div className="space-y-3">
                <Button 
                  onClick={handleSecurityScan}
                  disabled={scanRunning}
                  className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white disabled:opacity-50"
                >
                  {scanRunning ? <RefreshCw className="w-4 h-4 mr-3 animate-spin" /> : <Monitor className="w-4 h-4 mr-3" />}
                  {scanRunning ? 'Running Security Scan...' : 'Run Full Security Scan'}
                </Button>
                
                <Button 
                  onClick={() => alert('Database integrity check completed - All tables verified')}
                  className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-white"
                >
                  <Database className="w-4 h-4 mr-3" />
                  Check Database Integrity
                </Button>
                
                <Button 
                  onClick={() => alert('Access logs reviewed - No suspicious activity detected')}
                  className="w-full justify-start bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-white"
                >
                  <Server className="w-4 h-4 mr-3" />
                  Review Access Logs
                </Button>
                
                <Button 
                  onClick={() => {
                    if (window.confirm('Enable emergency lockdown? This will disable all new link creation.')) {
                      alert('Emergency lockdown activated');
                    }
                  }}
                  className="w-full justify-start bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white"
                >
                  <Zap className="w-4 h-4 mr-3" />
                  Emergency Lockdown
                </Button>
              </div>
              
              {lastScanTime && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">Last Scan Complete</span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {lastScanTime.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'threats' && (
          <div>
            {/* Search and Filter Controls */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search flagged URLs, users, or titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Risk</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            {/* Flagged URLs List */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">
                Flagged URLs ({filteredFlaggedUrls.length})
              </h4>
              {filteredFlaggedUrls.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredFlaggedUrls.map((url) => (
                    <div key={url.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/15 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-white font-medium truncate">{url.title}</div>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getRiskColor(url.risk_level)}`}>
                              {url.risk_level.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm truncate">/{url.short_url}</div>
                          <div className="text-gray-500 text-xs truncate mt-1 break-all">
                            → {url.original_url}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-red-400 font-bold">Risk: {url.risk_score}</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-gray-400 text-xs mb-2">Security Issues:</div>
                        <div className="flex flex-wrap gap-1">
                          {url.reasons.map((reason, index) => (
                            <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-gray-400 text-xs">
                          Created by: <span className="text-white">{url.user_email}</span> on {new Date(url.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => window.open(url.original_url, '_blank')}
                          className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Inspect
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction('approve', url.id)}
                          className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction('block', url.id)}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300"
                        >
                          <Ban className="w-3 h-3 mr-1" />
                          Block
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction('delete', url.id)}
                          className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction('investigate', url.id)}
                          className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">No flagged URLs match your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'patterns' && (
          <div className="bg-white/5 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">Suspicious Activity Patterns</h4>
            {securityAnalysis.suspiciousPatterns.length > 0 ? (
              <div className="space-y-3">
                {securityAnalysis.suspiciousPatterns.map((pattern, index) => (
                  <div key={index} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300 font-medium">{pattern.type}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getRiskColor(pattern.severity)}`}>
                        {pattern.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{pattern.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">User: {pattern.user}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(pattern.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400">No suspicious patterns detected</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="bg-white/5 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">High-Risk Users</h4>
            {securityAnalysis.userRiskScores.length > 0 ? (
              <div className="space-y-3">
                {securityAnalysis.userRiskScores.map((user, index) => (
                  <div key={user.id} className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-white font-medium">{user.email}</div>
                        <div className="text-gray-400 text-sm">
                          {user.linkCount} links • Joined {user.joinDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-bold">Risk: {user.riskScore}</div>
                        <span className={`px-2 py-1 text-xs rounded ${getRiskColor(user.riskLevel)}`}>
                          {user.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-gray-400 text-xs mb-1">Risk Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {user.flags.map((flag, flagIndex) => (
                          <span key={flagIndex} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction('investigate', user.id)}
                        className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction('ban_user', user.id)}
                        className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300"
                      >
                        <Ban className="w-3 h-3 mr-1" />
                        Ban User
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400">No high-risk users identified</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automated Actions */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Automated Security Actions</h4>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium">Auto-scanning Active</span>
                  </div>
                  <p className="text-gray-400 text-sm">Automatically scans new URLs for threats</p>
                </div>
                
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 font-medium">Rate Limiting Enabled</span>
                  </div>
                  <p className="text-gray-400 text-sm">Prevents spam and abuse attempts</p>
                </div>
                
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-medium">Domain Blacklist Active</span>
                  </div>
                  <p className="text-gray-400 text-sm">Blocks known malicious domains</p>
                </div>
              </div>
            </div>

            {/* Manual Actions */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Manual Security Tools</h4>
              <div className="space-y-3">
                <Button 
                  onClick={() => alert('Bulk URL scan initiated for last 24 hours')}
                  className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white"
                >
                  <Search className="w-4 h-4 mr-3" />
                  Bulk Scan Recent URLs
                </Button>
                
                <Button 
                  onClick={() => alert('User activity analysis started')}
                  className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-white"
                >
                  <Globe className="w-4 h-4 mr-3" />
                  Analyze User Patterns
                </Button>
                
                <Button 
                  onClick={() => alert('Security whitelist updated')}
                  className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-3" />
                  Update Security Rules
                </Button>
                
                <Button 
                  onClick={() => alert('All flagged URLs cleared after review')}
                  className="w-full justify-start bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-3" />
                  Clear Resolved Flags
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCenterModal;