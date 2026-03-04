import React, { useState, useEffect } from 'react';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [hasInvitationCode, setHasInvitationCode] = useState(null);
  const [invitationCode, setInvitationCode] = useState('');
  const [penName, setPenName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [authorIntro, setAuthorIntro] = useState('');
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [invitationCodeValid, setInvitationCodeValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'phone':
        setPhone(value);
        break;
      case 'verificationCode':
        setVerificationCode(value);
        break;
      case 'invitationCode':
        setInvitationCode(value);
        break;
      case 'penName':
        setPenName(value);
        break;
      case 'contactInfo':
        setContactInfo(value);
        break;
      case 'authorIntro':
        setAuthorIntro(value);
        break;
      case 'realName':
        setRealName(value);
        break;
      case 'idNumber':
        setIdNumber(value);
        break;
      default:
        break;
    }
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 处理头像上传
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 发送验证码
  const handleSendCode = () => {
    if (!phone) {
      setErrors(prev => ({
        ...prev,
        phone: '请输入手机号'
      }));
      return;
    }
    if (phone.length !== 11) {
      setErrors(prev => ({
        ...prev,
        phone: '请输入有效的手机号'
      }));
      return;
    }
    
    setIsSendingCode(true);
    // 模拟发送验证码
    setTimeout(() => {
      setIsSendingCode(false);
      setSuccessMessage('验证码已发送');
      setCountdown(60);
      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  // 验证手机号和验证码
  const validatePhoneAndCode = () => {
    const newErrors = {};
    if (!phone) {
      newErrors.phone = '请输入手机号';
    } else if (phone.length !== 11) {
      newErrors.phone = '请输入有效的手机号';
    }
    if (!verificationCode) {
      newErrors.verificationCode = '请输入验证码';
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = '验证码为6位数字';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证邀请码
  const validateInvitationCode = () => {
    const newErrors = {};
    if (!invitationCode) {
      newErrors.invitationCode = '请输入邀请码';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证笔名
  const validatePenName = () => {
    const newErrors = {};
    if (!penName) {
      newErrors.penName = '请填写笔名';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证联系方式
  const validateContactInfo = () => {
    const newErrors = {};
    if (!contactInfo) {
      newErrors.contactInfo = '请填写联系方式';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证作者简介
  const validateAuthorIntro = () => {
    const newErrors = {};
    if (!authorIntro) {
      newErrors.authorIntro = '请填写作者简介';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证真实姓名和身份证号
  const validateRealInfo = () => {
    const newErrors = {};
    if (!realName) {
      newErrors.realName = '请填写真实姓名';
    }
    if (!idNumber) {
      newErrors.idNumber = '请填写身份证号';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证协议同意
  const validateAgreeTerms = () => {
    const newErrors = {};
    if (!agreeTerms) {
      newErrors.agreeTerms = '请阅读并同意用户协议';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 下一步
  const handleNext = () => {
    if (currentStep === 1) {
      if (validatePhoneAndCode()) {
        setIsLoading(true);
        // 模拟验证手机号
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(2);
        }, 1000);
      }
    } else if (currentStep === 2) {
      if (hasInvitationCode === null) {
        setErrors({ hasInvitationCode: '请选择是否有邀请码' });
        return;
      }
      if (hasInvitationCode) {
        if (validateInvitationCode()) {
          setIsLoading(true);
          // 模拟校验邀请码
          setTimeout(() => {
            setIsLoading(false);
            if (invitationCode === '123456') {
              setInvitationCodeValid(true);
              setCurrentStep(3);
            } else {
              setInvitationCodeValid(false);
            }
          }, 800);
        }
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      // 合并后的信息填写页面，验证所有字段
      let isValid = true;
      const newErrors = {};
      
      if (!penName) {
        newErrors.penName = '请填写笔名';
        isValid = false;
      }
      if (!contactInfo) {
        newErrors.contactInfo = '请填写联系方式';
        isValid = false;
      }
      if (!authorIntro) {
        newErrors.authorIntro = '请填写作者简介';
        isValid = false;
      }
      if (hasInvitationCode) {
        if (!realName) {
          newErrors.realName = '请填写真实姓名';
          isValid = false;
        }
        if (!idNumber) {
          newErrors.idNumber = '请填写身份证号';
          isValid = false;
        }
      }
      if (!agreeTerms) {
        newErrors.agreeTerms = '请阅读并同意用户协议';
        isValid = false;
      }
      
      setErrors(newErrors);
      
      if (isValid) {
        setIsLoading(true);
        // 模拟提交
        setTimeout(() => {
          setIsLoading(false);
          setIsLoggedIn(true);
        }, 1200);
      }
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 重置表单
  const resetForm = () => {
    setCurrentStep(1);
    setPhone('');
    setVerificationCode('');
    setHasInvitationCode(null);
    setInvitationCode('');
    setPenName('');
    setContactInfo('');
    setAuthorIntro('');
    setRealName('');
    setIdNumber('');
    setErrors({});
    setSuccessMessage('');
    setIsSendingCode(false);
    setCountdown(0);
    setInvitationCodeValid(null);
    setAvatar(null);
    setAgreeTerms(false);
    setIsLoggedIn(false);
  };

  // 工作台导航
  const navigateTo = (section) => {
    // 模拟导航
    console.log(`导航到: ${section}`);
  };

  return (
    <div>
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="navbar-logo">
            <img src="https://via.placeholder.com/32" alt="Logo" />
            点众创作者平台
          </a>
          <div className="navbar-links">
            <a href="#" className="navbar-link">首页</a>
            <a href="#" className="navbar-link">创作者课堂</a>
            <a href="#" className="navbar-link">创作者福利</a>
            <a href="#" className="navbar-link">帮助中心</a>
          </div>
          <div className="navbar-user">
            <span>登录/注册</span>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* 页面标题 */}
        <div className="page-title">
          <h1 style={{ color: '#ff6a00' }}>成为创作者</h1>
          <p>欢迎加入我们的创作者团队，分享您的创作才华</p>
        </div>

        <div className="card">
          {/* 步骤指示器 */}
          {!isLoggedIn && currentStep < 4 && (
            <div className="step-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-text">手机号验证</div>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-text">邀请码验证</div>
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-text">填写信息</div>
              </div>
            </div>
          )}

          {/* 步骤1：手机号+验证码登录/注册 */}
          {currentStep === 1 && (
            <div className="fade-in">
              <div className="form-group">
                <label htmlFor="phone">手机号</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="请输入11位手机号"
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="verificationCode">验证码</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={handleInputChange}
                    placeholder="请输入短信验证码"
                    style={{ flex: 1 }}
                  />
                  <button 
                    className="btn-primary"
                    onClick={handleSendCode} 
                    disabled={isSendingCode || countdown > 0}
                  >
                    {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </button>
                </div>
                {errors.verificationCode && <div className="error-message">{errors.verificationCode}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleNext} disabled={isLoading}>
                  {isLoading ? <span className="loading">登录/注册</span> : '登录/注册'}
                </button>
              </div>
            </div>
          )}

          {/* 步骤2：是否有邀请码？ */}
          {currentStep === 2 && (
            <div className="fade-in">
              <h2>邀请码验证</h2>
              <p>您是否有邀请码？</p>
              <div className="invitation-options">
                <div 
                  className={`invitation-option ${hasInvitationCode === true ? 'selected' : ''}`}
                  onClick={() => setHasInvitationCode(true)}
                >
                  <h3>有邀请码</h3>
                  <p>通过邀请码注册，享受更多权益</p>
                </div>
                <div 
                  className={`invitation-option ${hasInvitationCode === false ? 'selected' : ''}`}
                  onClick={() => setHasInvitationCode(false)}
                >
                  <h3>没有邀请码</h3>
                  <p>公测期间，无需邀请码即可注册</p>
                </div>
              </div>
              {errors.hasInvitationCode && <div className="error-message">{errors.hasInvitationCode}</div>}
              {hasInvitationCode && (
                <div className="form-group">
                  <label htmlFor="invitationCode">邀请码</label>
                  <input
                    type="text"
                    id="invitationCode"
                    name="invitationCode"
                    value={invitationCode}
                    onChange={handleInputChange}
                    placeholder="请输入邀请码"
                  />
                  {errors.invitationCode && <div className="error-message">{errors.invitationCode}</div>}
                  {invitationCodeValid === false && <div className="error-message">邀请码无效</div>}
                </div>
              )}
              <div className="form-actions">
                <button className="btn-primary" onClick={handleNext} disabled={isLoading}>
                  {isLoading ? <span className="loading">处理中</span> : hasInvitationCode ? '校验邀请码' : '进入公测流程'}
                </button>
              </div>
            </div>
          )}

          {/* 步骤3：合并的信息填写页面 */}
          {currentStep === 3 && (
            <div className="fade-in">
              <h2>填写个人信息</h2>
              
              {/* 头像上传 */}
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatar ? (
                    <img src={avatar} alt="头像" />
                  ) : (
                    <span>上传头像</span>
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    id="avatar" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="avatar" className="avatar-upload-btn">上传头像</label>
                  <p className="form-hint">建议上传清晰的个人头像，有助于读者认识您</p>
                </div>
              </div>
              
              {/* 笔名 */}
              <div className="form-group">
                <label htmlFor="penName">笔名</label>
                <input
                  type="text"
                  id="penName"
                  name="penName"
                  value={penName}
                  onChange={handleInputChange}
                  placeholder="请填写您的笔名"
                />
                <p className="form-hint">笔名要求为汉字或英文，注册后可修改</p>
                {errors.penName && <div className="error-message">{errors.penName}</div>}
              </div>
              
              {/* 联系方式 */}
              <div className="form-group">
                <label htmlFor="contactInfo">联系方式</label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={contactInfo}
                  onChange={handleInputChange}
                  placeholder="请填写您的联系方式"
                />
                <p className="form-hint">请填写真实有效的联系方式，以便我们与您联系</p>
                {errors.contactInfo && <div className="error-message">{errors.contactInfo}</div>}
              </div>
              
              {/* 作者简介 */}
              <div className="form-group">
                <label htmlFor="authorIntro">作者简介</label>
                <textarea
                  id="authorIntro"
                  name="authorIntro"
                  value={authorIntro}
                  onChange={handleInputChange}
                  placeholder="请填写您的作者简介，10-30字"
                  maxLength={30}
                />
                <div className="form-counter">{authorIntro.length}/30</div>
                <p className="form-hint">内容完整通顺，请勿使用特殊符号，展示个人特色，写作经验，创作方向等</p>
                {errors.authorIntro && <div className="error-message">{errors.authorIntro}</div>}
              </div>
              
              {/* 真实信息（有邀请码时） */}
              {hasInvitationCode && (
                <>
                  <div className="form-group">
                    <label htmlFor="realName">真实姓名</label>
                    <input
                      type="text"
                      id="realName"
                      name="realName"
                      value={realName}
                      onChange={handleInputChange}
                      placeholder="请填写您的真实姓名"
                    />
                    {errors.realName && <div className="error-message">{errors.realName}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="idNumber">身份证号</label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={idNumber}
                      onChange={handleInputChange}
                      placeholder="请填写您的身份证号"
                    />
                    {errors.idNumber && <div className="error-message">{errors.idNumber}</div>}
                  </div>
                </>
              )}
              
              {/* 协议同意 */}
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label htmlFor="agreeTerms">
                  我已阅读并同意 <a href="#">《用户协议》</a>、<a href="#">《隐私政策》</a> 和 <a href="#">《创作者签约规则》</a>
                </label>
              </div>
              {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
              
              <div className="flow-buttons">
                <button className="btn-secondary" onClick={handlePrevious}>上一步</button>
                <button className="btn-primary" onClick={handleNext} disabled={isLoading}>
                  {isLoading ? <span className="loading">提交中</span> : hasInvitationCode ? '提交审核' : '提交资料'}
                </button>
              </div>
            </div>
          )}

          {/* 工作台首页 */}
          {isLoggedIn && (
            <div className="workspace fade-in">
              <div className="workspace-header">
                <h2>创作者工作台</h2>
                <div className="user-info">
                  <span>下午好，{penName || '创作者'}！</span>
                  <span className="user-avatar">
                    {avatar ? (
                      <img src={avatar} alt="头像" />
                    ) : (
                      <span>{penName ? penName.charAt(0) : '创'}</span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="workspace-stats">
                <div className="stat-card">
                  <h3>本月更新字数</h3>
                  <p>0</p>
                </div>
                <div className="stat-card">
                  <h3>累计字数</h3>
                  <p>0</p>
                </div>
                <div className="stat-card">
                  <h3>粉丝数</h3>
                  <p>0</p>
                </div>
              </div>
              
              {/* 签约流程 */}
              <div className="contract-flow">
                <h3>签约流程</h3>
                <div className="flow-steps">
                  <div className="flow-step active">
                    <div className="flow-step-number">1</div>
                    <div className="flow-step-text">注册成为作者</div>
                    <div className="flow-step-status">已完成</div>
                  </div>
                  <div className="flow-step">
                    <div className="flow-step-number">2</div>
                    <div className="flow-step-text">上传作品</div>
                    <div className="flow-step-status">未开始</div>
                  </div>
                  <div className="flow-step">
                    <div className="flow-step-number">3</div>
                    <div className="flow-step-text">申请签约</div>
                    <div className="flow-step-status">未开始</div>
                  </div>
                  <div className="flow-step">
                    <div className="flow-step-number">4</div>
                    <div className="flow-step-text">签署合同</div>
                    <div className="flow-step-status">未开始</div>
                  </div>
                  <div className="flow-step">
                    <div className="flow-step-number">5</div>
                    <div className="flow-step-text">作品上架</div>
                    <div className="flow-step-status">未开始</div>
                  </div>
                </div>
              </div>
              
              {/* 作品管理 */}
              <div className="works-section">
                <h3>作品管理</h3>
                <div className="no-works">
                  <p>暂无作品</p>
                  <p>点击下方创建新作品，开始您的创作之旅吧</p>
                  <button className="btn-primary">创建新作品</button>
                </div>
              </div>
              
              {/* 侧边导航 */}
              <div className="workspace-nav">
                <ul>
                  <li className="active">
                    <a href="#" onClick={() => navigateTo('workspace')}>工作台</a>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigateTo('works')}>作品管理</a>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigateTo('data')}>数据中心</a>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigateTo('profile')}>个人中心</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;