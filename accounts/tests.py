from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from accounts.models import Profile

class AccountsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='testpassword123'
        )

    def test_profile_auto_created(self):
        """Test that profile is automatically created via post_save signal."""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertEqual(self.user.profile.user, self.user)

    def test_signup_view_get(self):
        """Test GET request to signup page."""
        response = self.client.get(reverse('accounts:signup'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/signup.html')

    def test_signup_view_post_success(self):
        """Test successful signup creates user and logs in."""
        response = self.client.post(reverse('accounts:signup'), {
            'username': 'bob',
            'email': 'bob@example.com',
            'password1': 'StrongPass1234!',
            'password2': 'StrongPass1234!',
            'agree_pdpa': True,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='bob').exists())

    def test_login_and_logout(self):
        """Test login and logout flow."""
        # Login
        response = self.client.post(reverse('accounts:login'), {
            'username': 'alice',
            'password': 'testpassword123'
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(int(self.client.session['_auth_user_id']), self.user.pk)

        # Logout
        response = self.client.post(reverse('accounts:logout'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_profile_view_authenticated(self):
        """Test profile page access for authenticated user."""
        self.client.login(username='alice', password='testpassword123')
        response = self.client.get(reverse('accounts:profile_me'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/profile.html')
        self.assertContains(response, 'alice')

    def test_profile_edit_view(self):
        """Test profile edit updates bio."""
        self.client.login(username='alice', password='testpassword123')
        response = self.client.post(reverse('accounts:profile_edit'), {
            'first_name': 'Alice',
            'last_name': 'Wonder',
            'email': 'alice.w@example.com',
            'bio': 'Traveler and food lover.',
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Alice')
        self.assertEqual(self.user.profile.bio, 'Traveler and food lover.')

    def test_password_reset_otp_flow(self):
        """Test complete OTP password reset flow."""
        from accounts.models import PasswordResetOTP

        # 1. Request OTP
        resp = self.client.post(reverse('accounts:password_reset_request'), {
            'email': 'alice@example.com'
        })
        self.assertEqual(resp.status_code, 302)
        self.assertRedirects(resp, reverse('accounts:password_reset_verify'))

        otp = PasswordResetOTP.objects.filter(user=self.user, is_used=False).first()
        self.assertIsNotNone(otp)
        self.assertEqual(len(otp.otp_code), 6)

        # 2. Verify with wrong OTP
        resp_wrong = self.client.post(reverse('accounts:password_reset_verify'), {
            'otp_code': '000000'
        })
        self.assertEqual(resp_wrong.status_code, 200)
        self.assertContains(resp_wrong, 'รหัส OTP ไม่ถูกต้อง')

        # 3. Verify with correct OTP
        resp_correct = self.client.post(reverse('accounts:password_reset_verify'), {
            'otp_code': otp.otp_code
        })
        self.assertEqual(resp_correct.status_code, 302)
        self.assertRedirects(resp_correct, reverse('accounts:password_reset_confirm'))

        otp.refresh_from_db()
        self.assertTrue(otp.is_used)

        # 4. Set new password
        resp_confirm = self.client.post(reverse('accounts:password_reset_confirm'), {
            'new_password': 'BrandNewPassword123!',
            'confirm_password': 'BrandNewPassword123!',
        })
        self.assertEqual(resp_confirm.status_code, 302)
        self.assertRedirects(resp_confirm, reverse('accounts:login'))

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('BrandNewPassword123!'))
