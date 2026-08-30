import io
from PIL import Image
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from checkins.models import CheckIn, Like
from checkins.forms import CheckInForm

def create_dummy_image(filename="test.jpg", size=(200, 200), color=(255, 0, 0)):
    file_obj = io.BytesIO()
    image = Image.new("RGB", size=size, color=color)
    image.save(file_obj, format="JPEG")
    file_obj.seek(0)
    return SimpleUploadedFile(filename, file_obj.read(), content_type="image/jpeg")

class CheckInTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.alice = User.objects.create_user(
            username='alice', email='alice@example.com', password='password123'
        )
        self.bob = User.objects.create_user(
            username='bob', email='bob@example.com', password='password123'
        )
        self.photo = create_dummy_image()
        self.checkin = CheckIn.objects.create(
            user=self.alice,
            place_name='Central Park',
            caption='Relaxing afternoon in the park',
            photo=self.photo,
            latitude=13.7563,
            longitude=100.5018
        )

    def test_checkin_str_and_properties(self):
        """Test model __str__ and has_location property."""
        self.assertEqual(str(self.checkin), "Central Park โดย alice")
        self.assertTrue(self.checkin.has_location)

    def test_unauthenticated_access_redirects(self):
        """Test that anonymous users are redirected to login for protected views."""
        routes = [
            reverse('checkins:feed'),
            reverse('checkins:create'),
            reverse('checkins:detail', kwargs={'pk': self.checkin.pk}),
            reverse('checkins:edit', kwargs={'pk': self.checkin.pk}),
            reverse('checkins:delete', kwargs={'pk': self.checkin.pk}),
            reverse('checkins:map'),
        ]
        for url in routes:
            response = self.client.get(url)
            self.assertEqual(response.status_code, 302)
            self.assertTrue(response.url.startswith('/accounts/login/'))

    def test_feed_view_authenticated(self):
        """Test that authenticated users can see the feed with check-ins."""
        self.client.login(username='alice', password='password123')
        response = self.client.get(reverse('checkins:feed'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'checkins/feed.html')
        self.assertContains(response, 'Central Park')
        self.assertContains(response, 'Relaxing afternoon in the park')

    def test_checkin_create_view(self):
        """Test creating a check-in with GPS and photo."""
        self.client.login(username='alice', password='password123')
        new_photo = create_dummy_image('new.jpg')
        response = self.client.post(reverse('checkins:create'), {
            'place_name': 'Siam Paragon',
            'caption': 'Shopping and coffee time!',
            'latitude': 13.7462,
            'longitude': 100.5347,
            'photo': new_photo,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(CheckIn.objects.filter(place_name='Siam Paragon', user=self.alice).exists())

    def test_checkin_detail_view(self):
        """Test detail view display."""
        self.client.login(username='bob', password='password123')
        response = self.client.get(reverse('checkins:detail', kwargs={'pk': self.checkin.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'checkins/detail.html')
        self.assertContains(response, 'Central Park')
        self.assertFalse(response.context['is_owner'])

    def test_checkin_update_owner_only(self):
        """Test owner can update, non-owner gets 403 Forbidden."""
        # 1. Non-owner (Bob) attempts edit -> 403 Forbidden
        self.client.login(username='bob', password='password123')
        response = self.client.post(reverse('checkins:edit', kwargs={'pk': self.checkin.pk}), {
            'place_name': 'Hacked Park',
            'caption': 'Changed by bob',
        })
        self.assertEqual(response.status_code, 403)

        # 2. Owner (Alice) edits -> 200/302 Success
        self.client.login(username='alice', password='password123')
        response = self.client.post(reverse('checkins:edit', kwargs={'pk': self.checkin.pk}), {
            'place_name': 'Central Park Updated',
            'caption': 'Updated caption by alice',
            'latitude': 13.7563,
            'longitude': 100.5018,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.checkin.refresh_from_db()
        self.assertEqual(self.checkin.place_name, 'Central Park Updated')

    def test_checkin_delete_owner_only(self):
        """Test owner can delete, non-owner gets 403 Forbidden."""
        # 1. Non-owner (Bob) attempts delete -> 403 Forbidden
        self.client.login(username='bob', password='password123')
        response = self.client.post(reverse('checkins:delete', kwargs={'pk': self.checkin.pk}))
        self.assertEqual(response.status_code, 403)
        self.assertTrue(CheckIn.objects.filter(pk=self.checkin.pk).exists())

        # 2. Owner (Alice) deletes -> Success
        self.client.login(username='alice', password='password123')
        response = self.client.post(reverse('checkins:delete', kwargs={'pk': self.checkin.pk}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(CheckIn.objects.filter(pk=self.checkin.pk).exists())

    def test_toggle_like_view(self):
        """Test liking and unliking a checkin."""
        self.client.login(username='bob', password='password123')
        # Like
        response = self.client.post(
            reverse('checkins:like', kwargs={'pk': self.checkin.pk}),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['liked'])
        self.assertEqual(data['likes_count'], 1)
        self.assertTrue(Like.objects.filter(user=self.bob, checkin=self.checkin).exists())

        # Unlike
        response = self.client.post(
            reverse('checkins:like', kwargs={'pk': self.checkin.pk}),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['liked'])
        self.assertEqual(data['likes_count'], 0)
        self.assertFalse(Like.objects.filter(user=self.bob, checkin=self.checkin).exists())

    def test_photo_max_size_validator(self):
        """Test that photo upload exceeding 5MB fails validation."""
        fake_large_file = SimpleUploadedFile(
            "large_image.jpg",
            b"0" * (6 * 1024 * 1024),  # 6MB
            content_type="image/jpeg"
        )
        form = CheckInForm(
            data={'place_name': 'Test Place', 'caption': 'Test Caption'},
            files={'photo': fake_large_file}
        )
        self.assertFalse(form.is_valid())
        self.assertIn('photo', form.errors)

    def test_pillow_image_compression(self):
        """Test that uploaded image is automatically resized and compressed by Pillow."""
        # Create an oversized image (2000x2000)
        large_image_file = create_dummy_image("oversized.jpg", size=(2000, 2000), color=(0, 255, 0))
        checkin_large = CheckIn.objects.create(
            user=self.alice,
            place_name='Mountain Peak',
            caption='High altitude view',
            photo=large_image_file,
            latitude=18.5894,
            longitude=98.4867
        )
        # Verify saved image dimensions are clamped to <= 1600px
        saved_img = Image.open(checkin_large.photo.path)
        self.assertLessEqual(saved_img.width, 1600)
        self.assertLessEqual(saved_img.height, 1600)

