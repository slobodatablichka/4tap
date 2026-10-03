## Ordinary-app constraint

Android 4Tap — обычное пользовательское приложение на штатном Android.

Из активной архитектуры и roadmap исключены:
- изменение firmware/SystemUI;
- root и bootloader unlock;
- custom ROM / cross-flash;
- privileged/system app;
- обязательная OEM-интеграция;
- AOSP/Cuttlefish как путь реализации продукта.

Историческая SystemUI/AOSP ветвь хранится только как архив и не является вариантом следующего шага.

## Текущая версия

Интерактивная документация v0.5.

## Реализовано

- единая одностраничная карта KnockUI;
- разделы формируются из `data/sections.json`;
- точное место ячейки задаётся полями `section` и `order` в `data/cells.json`;
- охвачены Android, iOS, WeChat и WhatsApp;
- отражены B2C и B2B;
- добавлены региональная стратегия, roadmap и методология;
- каждая ячейка имеет интерактивное пояснение;
- подробная карточка показывает параметры, входы, выходы, ограничения и открытые вопросы;
- поиск по документации;
- фильтры по платформе и модели;
- фильтр по статусу;
- отдельный фильтр по результату технической проверки;
- типизированные видимые связи между ячейками (`flow / branch / model / constraint / strategy / roadmap / governance`);
- фильтр отображения связей;
- подписи активных связей;
- runtime-проверка ссылочной целостности графа;
- прямые URL на ячейки;
- матрица 1296 двухсимвольных комбинаций, включая пары из одинаковых символов.

## Редактирование

Схема содержательных файлов описана в `data/README.md`. Для добавления разделов, ячеек и связей менять HTML не требуется.

## Аудит полноты

Структурный аудит выполнен. Результаты и исправления зафиксированы в `AUDIT-2026-09-28.md`.

Состояние на момент аудита 2026-09-28:
- 50 ячеек;
- 79 связей;

Текущее состояние карты:
- 73 ячейки;
- 155 связей;
- roadmap развёрнут в шесть этапов: Android end-to-end → Product Canon → User Configuration → Integration Catalog → Launch/Monetization+B2B → Cross-platform;
- Android-поток дополнен разрешениями, валидацией зоны, fail-safe, обратной связью первого символа, хранилищем, редактором назначений, compliance и energy budget;
- iOS и WeChat имеют явные action-узлы;
- общие продуктовые принципы связаны с платформенными адаптациями;
- браузер проверяет несуществующие ссылки, дубликаты, неизвестные section/status/type и изолированные ячейки.

## Техническая верификация

Выполнена первая платформенная техническая проверка. Полный результат: `TECH-VERIFICATION-2026-09-28.md`.

Ключевые результаты:
- вывод проверки 2026-09-28 о пассивном raw-touch «где угодно» сохраняется только для того сценария; 2026-09-29 конкретный navigation-bar trigger через `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` подтверждён на физическом устройстве и снимает его как blocker текущего 4Tap flow;
- `TYPE_APPLICATION_OVERLAY` и permission flow подтверждены как рабочая технология для локального overlay после активации;
- универсальное определение «пустой/неактивной» точки в чужом приложении не может считаться гарантированным;
- Android intents/deep links подтверждены с ограничениями background activity launch и resolver;
- требования Google Play к AccessibilityService и package visibility внесены в документацию;
- проверка 2026-09-28 рассматривала $1 Recognizer как технический ориентир для MVP; текущий implementation-кандидат уже заменил S/C-only прототип собственным profile-driven matcher по 36 каноническим SVG, при этом реальное качество и threshold всё ещё требуют отдельной верификации;
- iOS Custom Keyboard подтверждён как ограниченная input surface; App Review Guideline 4.4.1 блокирует запуск произвольных приложений из keyboard extension;
- WeChat Mini Program подтверждён как локальная/contained среда, не глобальный OS-layer;
- WhatsApp Cloud API подтверждает чатовый command/response transport через webhooks;
- рыночные тезисы вынесены из технической проверки.

На карте появился отдельный узел `android-global-trigger-limitation`, а вводящая в заблуждение прямая flow-связь `android-integration → android-quad-tap` удалена.

## Следующий этап

Первый Android end-to-end рубеж пройден на `LGM-V300L / Android 9`:

`другое приложение → 4 тапа в LEFT/RIGHT области navigation bar → KnockUI → S → C → SC → Android Settings`.

Текущий trigger и KnockUI используют один `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY`; `SYSTEM_ALERT_WINDOW` удалён. ADB/debug broadcast для пользовательской цепочки не требуется. Recognizer v2.1 / Gesture Check / command flow входят в стабильный real-device baseline.

Ближайшие задачи:
1. сохранять текущий recognizer/Gesture Check baseline без изменений до новой воспроизводимой причины;
2. усовершенствовать саму поверхность KnockUI по Design Canon: сначала геометрия и поведение, затем project docs → code → build → real-device test;
3. после Design Canon сделать понятный one-step Accessibility onboarding;
4. подготовить Google Play Accessibility declaration / prominent disclosure / consent / review video и advance notice;
5. повторить механизм на более новых stock Android-устройствах.

## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation strategy — ordinary app

Подтверждённая текущая модель:

- 4Tap остаётся обычным приложением на штатном Android;
- пользователь выполняет 4 быстрых тапа в LEFT/RIGHT области navigation bar; продуктовый порог по-прежнему рассматривается как 3/4;
- `AccessibilityService` размещает две небольшие touchable `TYPE_ACCESSIBILITY_OVERLAY` зоны в navigation bar;
- полная последовательность формирует `ActivationRequest`;
- после запуска KnockUI trigger-зоны автоматически перевооружаются;
- SystemUI/AOSP/root/privileged/OEM-only пути исключены;
- Accessibility shortcut не используется.

На LG V30 механизм работает стабильно; LG-specific geometry остаётся только диагностическим baseline.

## Android runtime constraints

В публичной карте обновлён узел `android-runtime-constraints`.

Текущий Android-кандидат использует один user-granted capability:

- `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` — и navigation-bar trigger, и KnockUI поверх текущего приложения.

`SYSTEM_ALERT_WINDOW` удалён из manifest и не входит в текущий Android-path. AccessibilityService использует `canRetrieveWindowContent=false` и не читает содержимое экранов.

Google Play допускает AccessibilityService и для приложений, не являющихся accessibility tools, но требует declaration, prominent in-app disclosure, affirmative consent и review. Для приложения с AccessibilityService доступен advance notice App Review.

Текущий onboarding строится вокруг одного пользовательского включения Accessibility; это остаётся UX/compliance задачей, а не техническим blocker.

Остальные runtime-ограничения сохраняются: чувствительные экраны могут скрывать application overlay; запуск действий зависит от background-launch rules и intent/deep-link contracts; Settings Console учитывает package visibility.

## Android navigation-bar activation — PASS 2026-09-29

На физическом `LGM-V300L / Android 9` устойчиво подтверждено:

- Accessibility service `4Tap corner activation` включён пользователем;
- real display `1440×2880`, usable `1440×2733`, navigation bar height `147 px`;
- LEFT zone `(0,2712)`, RIGHT zone `(1104,2712)`, size `336×168 px`;
- обе зоны перекрывают navigation bar `Y=2733…2880`;
- 4 быстрых тапа LEFT/RIGHT стабильно запускают KnockUI;
- `S → C → SC` открывает Android Settings;
- после успешного запуска trigger-зоны автоматически re-arm через 700 ms;
- повторные циклы работают без перевключения AccessibilityService.

Предшествующий `ACTION_OUTSIDE` watcher признан непригодным для угловой фильтрации на LG: события приходили, но координаты тапа были `(0,0)`.

Текущий результат закрывает Stage 1 feasibility, но не утверждает финальную permission architecture.

## Android post-activation drawing

Зафиксировано отдельное техническое положение:
- сложность глобального вызова KnockUI не переносится автоматически на последующее рисование;
- после активации можно использовать небольшой временный touchable `TYPE_APPLICATION_OVERLAY`;
- overlay принимает штрихи KnockUI внутри своей области;
- нижележащее приложение в пределах canvas во время ввода не получает эти касания;
- pass-through для gesture canvas не требуется;
- ограничения Android 12 на untrusted pass-through поэтому не блокируют эту схему.

Добавлена ячейка `android-drawing-overlay`. Основной input flow теперь проходит через неё: `Local Canvas → Drawing Overlay Surface → Gesture 1`.


## Android overlay over WeChat / WhatsApp

Зафиксирована двухконтурная модель:
- на Android после успешной активации 4Tap может открыть временный Drawing Overlay Surface поверх текущего foreground app, в том числе поверх WeChat и WhatsApp;
- одновременно сохраняются собственные внутренние KnockUI-пути: WeChat Mini Program и WhatsApp Business/chat transport;
- эти пути независимы и не заменяют друг друга;
- данное решение относится к Android; iOS рассматривается отдельно.

Добавлена ячейка `android-overlay-over-host-apps`.



## Android prototype baseline

Получен первый подтверждённый результат рабочей реализации `4tap-app`:
- минимальный Android-проект создан и успешно собирается;
- debug APK установлен на физическое Android-устройство;
- приложение успешно запущено;
- контрольный экран `4Tap / KnockUI — RUNNING` подтверждён на устройстве.

Этот результат подтверждает только рабочий Android application baseline. Активация KnockUI, Quad Tap, Drawing Overlay Surface и распознавание жестов ещё не реализованы.

Следующий практический шаг: touch-диагностика и минимальная поверхность ввода, затем распознавание эталонных одноштриховых `S` и `C`.


## Android touch prototype

В рабочем репозитории `4tap-app` подтверждён следующий практический рубеж:
- минимальная touch-поверхность работает на физическом Android-устройстве;
- отображается реальная траектория пальца;
- фиксируются touch events, координаты и тайминги;
- результат подтверждён как `TOUCH OK`.

Следующий prototype subset — только оригинальные Palm Graffiti `S` и `C`. Минимальный направленно-чувствительный распознаватель для этих двух знаков уже реализован в коде и ожидает проверки на физическом устройстве.


## Android SC prototype

В рабочем `4tap-app` подтверждён первый жестовый результат на физическом Android-устройстве:
- touch-поверхность работает;
- оригинальный Palm Graffiti `S` распознаётся;
- оригинальный Palm Graffiti `C` распознаётся;
- последовательность `S → C` корректно формирует команду `SC`.

Это ограниченная верификация только двух эталонов и одной тестовой команды. Она не подтверждает качество полного алфавита A–Z / 0–9.

Следующий практический шаг — перенести уже работающий ввод в post-activation KnockUI flow с временной локальной поверхностью, сохранив диагностику.


## Android in-app end-to-end prototype

На физическом Android-устройстве подтверждена ограниченная сквозная цепочка внутри launcher Activity:
- левый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- правый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- после завершения canvas закрывается и последняя команда сохраняется на экране ожидания.

Результат зафиксирован как `LEFT SC OK`, `RIGHT SC OK`.

Граница подтверждения принципиальна: угловые зоны и canvas пока находятся внутри самого 4Tap-приложения. Это проверяет UX/тайминги/распознавание и внутреннюю композицию цепочки, но не доказывает глобальный Android/OEM Quad Tap и не является проверкой `TYPE_APPLICATION_OVERLAY` поверх чужого приложения.

Следующий Android-эксперимент — настоящий временный touchable overlay с тем же подтверждённым `S → C → SC`.


## Android overlay real-device verification

Подтверждён post-activation drawing на физическом Android-устройстве:
- настоящий touchable `TYPE_APPLICATION_OVERLAY` создаётся после тестовой in-app активации;
- overlay остаётся поверх другого foreground-приложения;
- Palm Graffiti `S → C` распознаётся внутри overlay;
- команда `SC` формируется корректно;
- overlay автоматически закрывается после команды;
- сценарий подтверждён для левой и правой стороны: `LEFT OVERLAY SC OK`, `RIGHT OVERLAY SC OK`.

Это существенно сужает Android-риск: post-activation input surface и двухсимвольное распознавание подтверждены. Неподтверждённым остаётся системный/OEM activation trigger, который должен вызывать уже рабочий overlay без предварительного открытия 4Tap Activity.


## Android activation contract verified

После архитектурного разделения повторно подтверждён полный downstream-контур на физическом Android-устройстве:
- `ActivationRequest`;
- `OverlayLauncher`;
- настоящий `TYPE_APPLICATION_OVERLAY`;
- Palm Graffiti recognizer;
- двухсимвольная команда `SC`.

Контрольный результат: `REFACTOR LEFT SC OK`, `RIGHT SC OK`.

Это подтверждает, что источник активации можно менять независимо от overlay/recognizer/command. Текущий in-app 4-tap остаётся test harness. Неподтверждённым остаётся ordinary-app lower-corner trigger, который должен подать тот же `ActivationRequest`.


## Android external activation adapter verified

Подтверждён внешний debug activation adapter на физическом Android-устройстве без предварительного открытия 4Tap Activity:

- explicit broadcast формирует тестовый `ActivationRequest`;
- уже проверенный `OverlayLauncher` открывает настоящий Drawing Overlay поверх другого foreground-приложения;
- `S → C → SC` завершается корректно;
- подтверждены обе стороны: `OEM LEFT SC OK`, `OEM RIGHT SC OK`.

Несмотря на историческое имя `OEM_SYSTEMUI_TEST`, этот adapter является только test harness. Он не задаёт production-архитектуру и не означает зависимость от OEM/SystemUI.

Конкретный production trigger — ordinary-app 3/4-tap sequence в нижнем углу — ещё требует end-to-end проверки.

## Android command action verified

На штатном `LGM-V300L / Android 9` подтверждён следующий рубеж:
- внешний debug trigger формирует `ActivationRequest`;
- настоящий `TYPE_APPLICATION_OVERLAY` открывается поверх другой программы;
- `S → C` формирует `SC`;
- после завершения команды overlay закрывается;
- `SC` запускает назначенное тестовое действие `Settings.ACTION_SETTINGS`.

Таким образом, downstream теперь подтверждён до реального Android action execution:

`ActivationRequest → OverlayLauncher → Drawing Overlay → Recognizer → Command → Action`.

Единственный незакрытый риск Stage 1 — ordinary-app lower-corner 3/4-tap activation без ADB/debug broadcast.

## LG V30 raw touch baseline

Для основной опытной площадки определён touchscreen input-device:

- node: `/dev/input/event1`;
- name: `touch_dev`;
- property: `INPUT_PROP_DIRECT`;
- raw X: `0..1439`;
- raw Y: `0..2879`.

Raw coordinate space совпадает с physical display `1440 × 2880` один-к-одному. Поэтому дальнейшие system-corner tests можно фиксировать непосредственно в физических координатах экрана.

## LG V30 test geometry baseline

Для первой физической Android-площадки `LGM-V300L / Android 9 / V300L30p` зафиксирована текущая геометрия:

- display: `1440 × 2880 px`;
- physical density: `640 dpi`;
- override density: `560 dpi`;
- `NavigationBar`: `[0,2733][1440,2880]`;
- высота панели: `147 px`.

Это диагностический baseline конкретного LG. Эти значения не задают product trigger geometry и не используются как доказательство ownership.

## Android lower-corner activation — canon

Каноническая модель:

- 4Tap — ordinary user app;
- нижний LEFT и RIGHT угол дают целевую область вызова;
- активация — **3 или 4 быстрых тапа**;
- если 4Tap получает всю последовательность, формируется `ActivationRequest`;
- если один или несколько тапов не получены из-за активности приложения, системы или другого обработчика, серия сбрасывается и активация не происходит;
- такой отказ считается естественным ограничением конкретного контекста;
- не требуется отдельная модель ownership/passthrough/replay;
- `TYPE_APPLICATION_OVERLAY` используется только после активации как Drawing Overlay.

Текущая задача — проверить именно эту последовательность на физическом устройстве, а не исследовать SystemUI или точную границу NavigationBar.

## Android SystemUI Quad Tap zone — archived

Ранее исследованная reserved-zone/SystemUI/AOSP ветвь закрыта и сохранена только в истории проекта.

Она не является:
- текущей архитектурой;
- запасным implementation path;
- roadmap branch;
- способом исправлять неудачные угловые активации.

Пользовательский 4Tap должен оставаться обычным приложением на штатном Android.

## Product / UX plan update

В ближайший Android-контур добавлены обязательные продуктовые задачи:

- `4Tap Design Canon`: v0.1 до существенной переработки KnockUI overlay, v0.2 после первой полной real-device цепочки, v1.0 перед публичной beta;
- `4Tap Graffiti Profile`: Palm Graffiti остаётся baseline, но 4Tap утверждает собственные канонические формы; неудобные знаки могут меняться, символ `X` уже вынесен на отдельную проверку;
- `4Tap Settings Console`: установленные/доступные приложения, default-привязки, обучение написанию знаков, UserGestures и пользовательская привязка команды к приложению/действию;
- Settings Console должен поддерживать отдельный приватный профиль `Founder 40`; сами 40 сокращений не публикуются в публичной карте;
- `Default Integration Catalog — Russia`: сначала проверенный app launch, затем документированные deep links/actions;
- российский launch: RuStore как основной канал, другие Android-магазины и Google Play как дополнительные;
- monetization baseline: Free + Pro, subscription только за продолжающийся сервис, B2B/OEM отдельно, без рекламы внутри основного KnockUI-flow;
- продвижение — demo-first: короткая реальная цепочка «текущий контекст → 4Tap → два знака → действие».

Эти направления зафиксированы отдельными связанными ячейками карты и входят в roadmap, а не считаются пост-MVP неопределённостями.

## Current public-map alignment

Публичная карта синхронизирована с рабочим планом `4tap-app`:

- подтверждённый Android milestone: другая программа → 3/4 быстрых угловых тапа → KnockUI → двухзнаковая команда → действие; текущий recognizer v2.1 / Gesture Check / command flow — stable real-device baseline;
- Android activation описан как ordinary-app lower-corner sequence;
- неудачная/неполная tap sequence означает reset, а не переход к системной модификации;
- SystemUI/AOSP ветвь помечена архивной и удалена из активного roadmap-графа;
- Local Canvas связан с общим `ActivationRequest`;
- текущий Product Canon focus — усовершенствование поверхности KnockUI; Design Canon, 4Tap Graffiti Profile, Settings Console, Founder 40 privacy rule и Russia Integration Catalog остаются в roadmap;
- RuStore остаётся primary Russia channel, Google Play и другие магазины — дополнительными;
- monetization и promotion сохранены отдельными продуктными узлами.

## Pair Selection / Command Space — current

Текущая каноническая модель выбора XY:

- Command Space содержит 1296 пар `A–Z + 0–9`; одинаковые пары разрешены;
- `Pair Selection / Выбор знакопары` — единственный механизм назначения XY;
- первый уровень: 36 Graffiti-знаков `6 × 6`;
- второй уровень: 36 вторых Graffiti-знаков `6 × 6`;
- задача второго уровня — только завершить выбор свободной `XY`;
- целевая строка второго уровня: `[Graffiti X] + [второй слот]`, без действия `ВЕДЕТ В`;
- после любой успешно выбранной свободной XY Pair Selection **всегда** открывает `Проверка жеста`;
- занятая пара в `КОМБИНАЦИИ` может открыть существующую `Command`;
- текстовый поиск `A–Z + 0–9` остаётся отдельной навигацией по Command Space;
- рисование не используется для назначения XY.

Текущий Android Command Space уже содержит двухэтапный 6×6 выбор, но ещё требует приведения второго уровня к этому целевому flow и повторного real-device review.

## Canonical Back header refinement

Утверждено общее правило header:

- если иное отдельно не предусмотрено, `Back` располагается слева в верхней заголовочной строке;
- header — `72 dp`;
- touch-area Back — `48 × 48 dp`;
- базовая грамматика: `Back → контекст (если нужен) → название поверхности → действия справа`.

Применено в Android-коде:

- `Commands`: `Back | КОМАНДЫ | Search | Menu`;
- `Destination`: `Back | [slot 1][slot 2] | ВЕДЕТ В`;
- существующая команда показывает в этих слотах текущий Graffiti XY без start/direction markers;
- новая команда через `ADD COMMAND → Destination` показывает два пустых слота.

Refinement реализован и ожидает повторный real-device review.

## Design Canon normalization — canon/graphics gate

После real-device просмотра UI зафиксировано новое обязательное правило разработки:

`общий Design Canon → реестр канонической графики → локальный канон поверхности → код`.

Если правила или нужного графического элемента нет, UI-реализация не начинается до его утверждения/создания.

Нормализовано:

- Back / Menu / Search: touch-area `48 × 48 dp`, видимая каноническая графика `40 × 40 dp`;
- Search является рамочной фирменной пиктограммой; системный Android search icon не используется по умолчанию;
- Frame зарегистрирован как канонический пустой квадрат для слотов/контейнеров;
- внутренняя геометрия и рамка определяются asset, а не отдельной приблизительной цифрой в локальном экране;
- один Back находится в верхнем header и выполняет один уровень назад в текущем контексте;
- второй уровень Command Space больше не имеет дублирующего Back в контекстной строке;
- текущий Android UI требует отдельного conformance-fix; новый PASS пока не зафиксирован.

## Android UI canon-conformance — implemented

По уже реализованным Android-поверхностям выполнено приведение к нормализованному Design Canon:

- добавлены точные Android-производные канонических `Search` и `Frame`;
- `Back / Search / Menu` используют общую схему `48 × 48 dp touch → 40 × 40 dp visible`;
- системный Android Search удалён из `Commands` и `Destination`;
- Menu больше не уменьшается произвольным padding/alpha;
- второй уровень `КОМБИНАЦИИ` больше не содержит дублирующий Back;
- верхний Back на втором уровне возвращает к первому уровню, аппаратный Back ведёт так же;
- слоты `Commands` и `Destination` используют канонический Frame;
- `Command` использует тот же общий helper канонического Back;
- KnockUI/MainActivity не содержат затронутых header-actions/Frame и в этом блоке не менялись.

Новый conformance-pass ещё не получил real-device PASS: требуется `assembleDebug` и повторная проверка на устройстве.

## Command creation / Gesture Check routing — current

Обе ветки используют общий блок:

`Pair Selection → Проверка жеста`.

`Проверка жеста` можно выполнить или пропустить; она не меняет XY.

Маршрутизационный инвариант после проверки:

1. известна `XY`, Destination отсутствует → `ВЕДЕТ В`;
2. Destination был выбран **до XY** через `НАЗНАЧИТЬ` → после выбора XY известны обе части → `КОМАНДА`;
3. при редактировании существующей команды Destination уже известен → новая XY возвращается в `КОМАНДА`.

Общее правило:

`XY + no Destination → ВЕДЕТ В`  
`XY + Destination → КОМАНДА`.

Отсюда два create-flow:

- destination-first: `ADD COMMAND → НАЗНАЧИТЬ → Destination → Pair Selection → Проверка жеста → Command`;
- pair-first: `Commands / КОМБИНАЦИИ → Pair Selection → Проверка жеста → ВЕДЕТ В → Destination → Command`.

Редактирование XY:

`Command → Pair Selection → Проверка жеста → Command`.

`ВЕДЕТ В` всегда требует известную XY. `НАЗНАЧИТЬ` используется только тогда, когда Destination выбирается до XY.

Android-маршрутизация подтверждена на физическом устройстве 2026-10-01: destination-first и pair-first проходят до конца. Новая созданная команда после этого трижды успешно выполнена через KnockUI. Existing-Command XY edit остаётся отдельной непроверенной device-веткой.

## Pair Selection — contextual geometry approved

The public architecture now records one shared Pair Selection geometry:

- one core for all contexts: persistent `[X] + [Y]` context row + `6×6 X → 6×6 Y`;
- the context row stays in the same place on both stages, so the grid does not jump;
- stage 1 shows `[□] + [□]`; stage 2 shows `[X] + [□]`;
- when Destination is already known it is shown at right as `ДЛЯ: Destination`;
- standalone destination-first/edit surface: `Back | ЗНАКОПАРА | Search`;
- Commands / КОМБИНАЦИИ hosts the same core under its existing Commands header and mode switch;
- free XY always goes directly to `Проверка жеста`; there is no `ДАЛЬШЕ`, `ВЕДЕТ В`, or `ДОБАВИТЬ КОМАНДУ` inside Pair Selection;
- occupied families/pairs are muted; Commands may inspect an occupied pair, while creation/edit cannot select it;
- the current self-pair of an edited Command does not conflict with itself;
- Search is navigation through the same selector: 1 character → X/Y stage, 2 characters → exact XY;
- Back: Y→X; standalone X after НАЗНАЧИТЬ→НАЗНАЧИТЬ preserving Destination; standalone X from Command→Command unchanged.

Pair Selection geometry is approved. The shared `PairSelectionGridView` + standalone `ЗНАКОПАРА` are present in the current Android baseline; pair-first and destination-first flows passed on a physical device. Existing-Command XY edit remains a separate explicit device check.

## Gesture Check — approved base surface

The public architecture now records the concrete Gesture Check behavior:

- `Back | ПРОВЕРКА ЖЕСТА`;
- both `[X] + [Y]` examples remain visible;
- при входе активен X и действует режим `AUTO`;
- успешный X в `AUTO` автоматически переводит активность на Y; FAIL не переключает знак;
- любой явный тап пользователя по X или Y переводит сессию в `MANUAL`, после чего автопереключение отключено;
- любой знак можно перерисовывать без ограничения, включая после PASS;
- один fixed drawing canvas не меняет положение из-за recognition feedback;
- feedback текстовый; новые PASS/FAIL pictograms не вводятся;
- fixed four-line zone резервирует до двух строк для последнего X-result и двух для Y;
- новая попытка очищает старый feedback только активного знака уже на `ACTION_DOWN`; результат второго знака сохраняется;
- before any attempt the bottom action is `ПРОПУСТИТЬ`; after an attempt it is `ПРОДОЛЖИТЬ`;
- PASS/FAIL never gates continuation and is not persisted as part of Command;
- exit routing remains `XY + no Destination → ВЕДЕТ В`, `XY + Destination → КОМАНДА`.

The current Android build uses a 72 dp pair row, adaptive canvas, fixed four × 24 dp feedback lines and fixed 56 dp bottom action. These implementation-level values are present in the stable physical-device baseline, but they are not promoted to generic canon solely by that stability result.

## Pair Selection / Gesture Check / Recognizer — Android candidate implemented

Private `4tap-app` now contains the complete implementation candidate for the approved command-flow block:

- one shared `PairSelectionGridView` for Commands, destination-first and existing-Command edit;
- standalone `Back | ЗНАКОПАРА | Search` surface;
- pair-first: `XY → Gesture Check → ВЕДЕТ В → Destination → Command`;
- destination-first: `НАЗНАЧИТЬ → Destination → ЗНАКОПАРА → Gesture Check → Command`;
- edit: `Command → ЗНАКОПАРА → Gesture Check → Command`;
- Gesture Check supports arbitrary X/Y switching, unlimited retries, independent latest-result feedback and non-blocking skip/continue;
- recognizer now loads all 36 canonical Profile v1 SVG strokes instead of hardcoded S/C templates;
- recognizer tests were added for all canonical self-matches, scale/translation invariance and S/5, I/1, Z/2.

Current verification status:

1. `testDebugUnitTest` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
2. `assembleDebug` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
3. pair-first and destination-first creation — real-device PASS;
4. newly created command execution through KnockUI — PASS ×3;
5. recognizer v2.1 / Gesture Check / current command flow — stable physical-device baseline;
6. Existing-Command XY edit — still requires its own explicit device check.

## Real-device command creation + recognizer review — 2026-10-01

Confirmed:

- destination-first creation — PASS;
- pair-first creation — PASS;
- a newly created command executed through KnockUI three times — PASS ×3.

Findings at the first 36-symbol checkpoint:

- the initial recognizer pipeline ran, but many finger-drawn symbols were misclassified;
- old F was especially impractical to recognize and was replaced by the canonical phi-like `Letter-F.svg`;
- Gesture Check showed a stale-feedback bug on retry;
- the approved fix clears only active-sign feedback at stroke start and preserves the other sign's result;
- the approved X/Y policy starts in `AUTO`, moves X PASS → Y, and switches permanently to `MANUAL` after an explicit X/Y tap.

These findings led to the v2 refinement below and are no longer the current recognizer status.

## Recognizer v2 + Gesture Check refinement — completed checkpoint

The approved v2 pass introduced:

- canonical revised F from the same Profile v1 SVG source;
- Gesture Check feedback reset at `ACTION_DOWN`;
- `AUTO → MANUAL` X/Y switching;
- 64-sample preprocessing plus bounded DTW;
- local comparison cost using normalized position (0.55), tangent/direction (0.30) and local turn (0.15);
- an 18% DTW band with minimum 6 samples and a 0.01 non-diagonal warp-step penalty;
- no real user-trace accumulation or personalization.

`testDebugUnitTest` and `assembleDebug` passed on 2026-10-01. The subsequent device review exposed O/Q and 4/9 cases and led directly to v2.1; this v2 checkpoint is closed.

## iOS implementation options

iOS больше не описывается как keyboard-only архитектура. Зафиксированы варианты реализации, окончательный выбор отложен.

Entry candidates:
- `Custom Keyboard Extension` — ввод внутри text-entry контекста;
- `Back Tap` — системный Double Tap/Triple Tap по задней панели с запуском Shortcut;
- `Action Button` — запуск Shortcut/Control на поддерживаемых моделях;
- `Control Center / Lock Screen Control` — WidgetKit Control.

Общий системный мост:
- `App Intents / Shortcuts Bridge` — связывает перечисленные системные triggers с действиями KnockUI.

Важно:
- эти механизмы не создают произвольный overlay поверх чужого iOS-приложения;
- часть App Intents может выполнять действие без отдельного UI, но это проверяется предметно для каждой команды;
- открытие приложения через intent/shortcut переводит пользователя в KnockUI app;
- конкретная комбинация entry/action paths пока не утверждена.

Добавлены ячейки `ios-back-tap`, `ios-action-button`, `ios-system-controls`, `ios-app-intents-shortcuts`. Ячейка `ios-activation` преобразована в общий узел вариантов.

## Accessibility-only KnockUI — PASS

2026-09-29 на `LGM-V300L / Android 9` подтверждена полная цепочка при выключенном системном доступе «Поверх других приложений»: `4 taps → AccessibilityService → TYPE_ACCESSIBILITY_OVERLAY KnockUI → S → C → SC → Settings`.

`SYSTEM_ALERT_WINDOW` затем полностью удалён из `AndroidManifest.xml`, сборка переустановлена и та же цепочка повторно прошла — PASS. Текущий Android-кандидат требует одного пользовательского системного включения: `4Tap corner activation` в Accessibility.


## Recognizer v2.1 — Q / O-Q / 4-9 refinement

Physical-device review found:

- `O → Q`;
- `4 → 9` in ten consecutive attempts.

The private implementation repo now contains:

- revised canonical `Letter-Q.svg`;
- updated Q checksum;
- generic template orientation from the canonical start marker, because raw SVG path order was found reversed for at least `C`, `O` and `4`;
- endpoint-aware score: start point/direction + end point/direction;
- extra terminal-tail weight over the last 13 of 64 samples;
- no symbol-specific classifier exceptions.

Status: `testDebugUnitTest` and `assembleDebug` — PASS; after installation the v2.1 build was confirmed stable on the physical Android device and is the current baseline.


## Stable Android recognizer baseline — 2026-10-01

After installing the build with revised Q, marker-oriented templates and endpoint/tail-aware recognizer v2.1, the user confirmed on a physical Android device:

**the current 4Tap works well and stably.**

This closes the pending physical-device verification status for recognizer v2.1 / Gesture Check / current command flow and establishes them as the current Android baseline.

Further recognizer changes are opened only for new reproducible problems or a separate planned calibration/personalization stage.

## KnockUI control strip canon — 2026-10-02

Утверждён следующий слой Product Canon KnockUI:

- KnockUI сохраняет две рабочие панели: `Ярлыки` / `Рисование`;
- верхняя полоса — отдельный functional control strip, не обычный `72 dp + Back + title` application header;
- порядок: `4Tap Logo | Ярлыки | Рисование | [Slot 1 | Slot 2 | Send — только Draw] | flexible space | Close`;
- Logo — служебная About-кнопка, а не третья панель; до появления мультфильма рабочая область показывает локализуемый длинный текст с изображениями и вертикальным scroll;
- на светлом фоне белая графика Logo инвертируется в `#159B92`;
- в Draw под control strip выделяется отдельная Destination-line;
- `Send` видим всегда в Draw, disabled до полной исполнимой пары и enabled после её получения;
- без выбора Slot действует `AUTO`: Slot 1 → Slot 2 → Destination preview → auto-Send после короткой заметной задержки;
- tap по Slot отменяет pending auto-Send и переводит Draw в `MANUAL`; выбранный Slot остаётся целью до явного выбора другого, а выполнение возможно только по `Send`;
- в private `4tap-app` добавлены канонические `logo-4tap.svg`, `send.svg`, `close.svg` рядом с существующими KnockUI icons.

Точные размеры окна/строк/control-strip элементов, интервалы, позиционирование, visual states и длительность AUTO-delay пока не утверждены. Следующий шаг — именно эта геометрия; recognizer v2.1 / Gesture Check baseline не меняется.

## KnockUI geometry + Android candidate — 2026-10-02

Подтверждены три решения следующего блока:

- KnockUI мыслится как **широкая компактная нижняя панель / широкое плавающее окно**;
- положение панели не зависит от LEFT/RIGHT trigger: окно центрируется по горизонтали и занимает почти всю ширину с симметричными боковыми отступами;
- высота адаптивная, ориентир `40–45%` доступной высоты, а не фиксированные `390 dp`;
- AUTO-delay после полной исполнимой пары — `1,0 s`; tap по Slot в этот период отменяет auto-Send и переводит Draw в MANUAL.

В private `4tap-app` внесён первый implementation candidate:

- `12 dp` side/bottom margin;
- `42%` screen height, clamp `300–420 dp`;
- `48 dp` control strip;
- `36 dp` Destination-line;
- Android vector derivatives утверждённых Logo / Quick Shortcuts / Drawing / Send / Close;
- persistence последней рабочей панели;
- Logo/About scroll-content;
- Draw Slot 1 / Slot 2;
- Destination preview;
- AUTO / MANUAL;
- executable Send и delayed auto-Send.

Recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/device PASS ещё не зафиксирован**. Следующий рубеж: `testDebugUnitTest → assembleDebug → install APK → real-device review`.

## KnockUI first device review + Logo/About Hub — 2026-10-02

Первый wide-bottom KnockUI candidate прошёл build/install и был просмотрен на физическом Android-устройстве. Общая поверхность оценена как удачная («вообще хорошо»), поэтому wide lower panel geometry principle сохраняется.

Зафиксированы следующие refinement-решения:

- полная распознанная пара без назначения показывает в Destination-line локализуемое `НЕ НАЗНАЧЕНО` / `NOT ASSIGNED`;
- в этом состоянии `Send` disabled, AUTO-send не запускается;
- представление по 4Tap Logo развивается в **Logo/About Hub**, но не становится третьей рабочей панелью;
- верх Hub — расширяемая область action-icons: первый ряд, при необходимости второй/третий, и только затем информационный текст/мультимедиа;
- первый ряд: `Открыть 4Tap` — рабочее действие; `ScreenCart` — future/placeholder; `Поддержать 4Tap` — future/placeholder;
- `Открыть 4Tap` должен закрыть KnockUI и открыть главную рабочую панель полного приложения;
- `Сайт 4Tap` пока не обязателен в первом ряду: URL, необходимость и окончательное место не утверждены;
- добавлены канонические Hub-assets `back-4_tap-dev.svg` и локальная копия `screencart-logo.svg`;
- внешний вид `back-4_tap-dev.svg` утверждён; его три строки `back / <4_tap> / dev` являются частью графики;
- отсутствие содержимого в панели `Ярлыки` сейчас не является дефектом: правила её заполнения будут проектироваться отдельным следующим Design Canon-блоком.

Текущий порядок: `canon/docs/assets → code → build/install → focused device review`. Recognizer v2.1 / Gesture Check baseline не изменяется.

## KnockUI Hub refinement implemented — 2026-10-02

Утверждённый refinement после первого device review реализован в private `4tap-app`:

- полная распознанная пара без assignment показывает локализуемое `НЕ НАЗНАЧЕНО / NOT ASSIGNED`;
- для такой пары `Send` остаётся disabled, AUTO-send не запускается;
- Logo/About показывает первый ряд Hub: `4Tap Logo | ScreenCart | Support 4Tap`, затем информационный текст;
- `Открыть 4Tap` закрывает KnockUI и открывает текущую рабочую поверхность полного приложения — `CommandsActivity`;
- ScreenCart и Support остаются видимыми future/placeholder без маршрута;
- текущий implementation candidate приглушает placeholders reduced-alpha способом; это пока не отдельный визуальный канон;
- добавлены Android derivatives `ic_knockui_screencart.xml` и `ic_knockui_support_4tap.xml`;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review этого refinement pending**.

Следующий шаг: `testDebugUnitTest → assembleDebug → installDebug → focused device review`, затем отдельное проектирование правил `Ярлыки`.

## Docked 4Tap canon — 2026-10-02

Утверждён новый layout/lifecycle-режим для действия `Открыть 4Tap` из Logo/About Hub.

**Docked 4Tap**:

- KnockUI не закрывается;
- нижний KnockUI становится full-width и остаётся закреплён снизу;
- полный 4Tap целиком занимает оставшуюся верхнюю область;
- обе части вместе заполняют доступную экранную область без перекрытия;
- внутренняя навигация полного 4Tap остаётся в верхней области;
- `Close` закрывает только KnockUI и разворачивает 4Tap на всю доступную область;
- выход из полного 4Tap или запуск внешнего приложения возвращает KnockUI к обычной floating-геометрии;
- другой функционал 4Tap/KnockUI не меняется.

Статус: **canon approved; Android implementation pending**.

## Docked 4Tap implementation candidate — 2026-10-02

Утверждённый Docked 4Tap реализован в Android-кандидате:

- KnockUI переключается `floating ↔ full-width docked` без изменения своей высоты;
- `Открыть 4Tap` сохраняет KnockUI и открывает `CommandsActivity` над ним;
- общий lifecycle-координатор переносит нижний inset, равный высоте KnockUI, на все внутренние Activity 4Tap;
- внутренние переходы 4Tap сохраняют docked layout;
- `Close` снимает inset и закрывает только KnockUI;
- выход из полного 4Tap возвращает KnockUI в floating;
- внешний command launch из docked-state сначала возвращает KnockUI в floating, затем использует прежний executor;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## Symmetric Docked 4Tap entry — 2026-10-02

Docked 4Tap уточнён как **симметричное** состояние независимо от порядка открытия компонентов:

- `KnockUI → Открыть 4Tap` и `полный 4Tap → corner-trigger → KnockUI` должны приводить к одной компоновке;
- если полный 4Tap уже открыт, corner-trigger создаёт KnockUI сразу в full-width docked-геометрии;
- текущий экран и состояние полного 4Tap сохраняются; автоматического перехода в `Commands` нет;
- в любом другом foreground-приложении corner-trigger продолжает открывать обычный floating KnockUI;
- остальной Docked-contract (`Close`, возврат в floating при выходе из 4Tap, внутренняя навигация сверху) не меняется.

Статус: **canon approved; reverse-entry Android refinement pending**.

## Symmetric Docked entry implemented — 2026-10-02

Обратный вход в Docked 4Tap реализован в Android-кандидате:

- `Application.ActivityLifecycleCallbacks` отслеживает реально resumed внутренние Activity 4Tap;
- при corner-trigger `DrawingOverlay` централизованно решает, создавать KnockUI floating или docked;
- если внутренний экран 4Tap уже foreground, KnockUI сразу создаётся full-width снизу;
- текущий Activity/экран/состояние 4Tap сохраняются и не заменяются `Commands`;
- в любом другом приложении сохраняется обычный floating KnockUI;
- `CornerAccessibilityService` не изменён; trigger остаётся прежним;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## KnockUI close semantics restored — 2026-10-02

После symmetric Docked entry восстановлен исходный контракт закрытия:

- `X / Close` всегда закрывает KnockUI;
- любая APP / WEB / SYSTEM-команда из KnockUI также закрывает его **до** запуска назначения;
- правило одинаково для floating и docked;
- если рядом открыт полный 4Tap, после `Close` он расправляется на всю доступную область;
- выход из полного 4Tap без выполнения команды по-прежнему возвращает KnockUI из docked в floating.

Регресс исправлен в private Android-коде; build/install/device review этой коррекции pending.

## Docked 4Tap preliminary device PASS — 2026-10-02

Текущий symmetric Docked 4Tap candidate с восстановленным close-contract проверен на физическом Android-устройстве. Пользователь сообщил: **«Вроде всё в порядке»**.

Предварительно подтверждены совместная компоновка 4Tap + KnockUI, обратный вход через corner-trigger, закрытие по `X` и закрытие KnockUI перед выполнением APP / WEB / SYSTEM-команды.

Статус: **preliminary real-device PASS**. Расширенный regression-pass всех внутренних экранов в Docked 4Tap пока отдельно не объявлен завершённым.

## Graffiti rendering scale canon — 2026-10-02

Утверждён единый принцип визуализации канонических Graffiti-знаков на поверхностях разного размера:

- path, толщина trajectory, start point и end arrow масштабируются как единый знак;
- фиксированная независимая `dp`-толщина эталонной/сохранённой траектории по отдельным поверхностям не допускается;
- live finger stroke в KnockUI / Gesture Check остаётся отдельным feedback-layer;
- числовое относительное значение толщины пока не назначено: его нужно получить из уже визуально принятого эталонного размера;
- реализация должна быть общей для Graffiti renderer/helper, а не набором независимых поправок по экранам.

Причина: на малых знаках текущая фиксированная толщина линии становится непропорционально большой и может перекрывать соседние участки траектории.

Статус: **canon approved; implementation pending**.

## Graffiti SVG visual source clarification — 2026-10-02

Уточнён источник визуального эталона Graffiti: предоставленные канонические SVG уже содержат утверждённое сочетание размера и толщины.

Renderer должен сохранять `viewBox + trajectory geometry + stroke-width + start/end marker geometry` каждого SVG и масштабировать их одним transform. Отдельный универсальный коэффициент толщины не требуется.

Текущий Android renderer этот контракт пока не выполняет: он извлекает path/viewBox, но заменяет SVG stroke/guide geometry фиксированными dp-значениями. Статус: **canon clarified; implementation pending**.

## SVG-aware Graffiti renderer implemented — 2026-10-02

Android-кандидат переведён на сохранение визуальных пропорций canonical 4Tap Graffiti SVG:

- `GraffitiGlyphRepository` читает `stroke-width`, start marker и end arrow;
- общий `GraffitiRenderer` масштабирует path, толщину trajectory и guide geometry одним transform;
- `GraffitiGlyphView`, `GraffitiPairView` и KnockUI slots используют общий renderer;
- прежние фиксированные толщины `3.5 / 6 / 2.2 dp` для эталонных знаков устранены;
- практический эталон source SVG: около 45 мм высоты знака → около 3 мм trajectory;
- правило относится только к 4Tap Graffiti, не к live finger stroke и другой UI-графике;
- recognizer v2.1 и canonical SVG не изменены;
- отдельный SVG metadata test не добавлен по принятому решению.

Статус: **implementation candidate; build/install/device review pending**.

## Commands assignment Graffiti composition canon — 2026-10-02

Утверждена новая геометрия 4Tap Graffiti в `Команды → НАЗНАЧЕНИЯ`:

- строка остаётся `64 dp`;
- целевая высота Graffiti — `38–40 dp`; ширина не должна уменьшать эту высоту;
- `X` задаёт эталон высоты и базовую рабочую ширину;
- каждый знак сохраняет естественную SVG-ширину; `I` остаётся узким, `W/M` не уменьшаются по высоте;
- два знака образуют единую композицию, а не две равные ячейки;
- side inset — `4 dp`, inter-glyph gap — `4 dp`;
- базовая ширина рассчитывается от двух X на целевой высоте с `8%` резервом на знак; текущие W/M примерно на `6,7%` шире X при равной высоте;
- Destination уступает ширину через end ellipsis прежде, чем Graffiti начинает терять высоту.

Общее правило guide-маркеров 4Tap Graffiti:

- rendered glyph height `>=36 dp` → обязательны начальный кружок и конечный треугольник;
- rendered glyph height `<36 dp` → оба маркера скрываются;
- порог измеряется в dp, не raw pixels;
- прежнее исключение для назначенной строки Commands отменено.

Статус: **canon approved; Android implementation pending**. Recognizer v2.1 не затрагивается.

## Commands assignment Graffiti layout implemented — 2026-10-02

Android candidate теперь реализует утверждённую геометрию `Команды → НАЗНАЧЕНИЯ`:

- Graffiti-колонка получает рабочую ширину, вычисленную от canonical `X`, а не жёсткий вес `24%`;
- compact pair использует целевую высоту `40 dp`, естественные SVG-ширины, `4 dp` side inset и `4 dp` inter-glyph gap;
- в расчёт ширины заложен `8%` reserve на каждый знак;
- пара центрируется как единая композиция и не делится на две равные ячейки;
- shared `GraffitiRenderer` показывает start circle + end triangle при rendered height `>=36 dp` и скрывает оба ниже порога;
- локальные show/hide guides overrides удалены;
- recognizer v2.1 и live finger stroke не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## Commands assignment Graffiti two-column correction — 2026-10-02

После первого просмотра implementation candidate уточнена структура Graffiti-зоны в `Команды → НАЗНАЧЕНИЯ`.

Исправлено в каноне и Android-коде:

- Graffiti-зона состоит из двух постоянных столбцов одинаковой рабочей ширины;
- первый знак любой знакопары всегда центрируется в первом столбце, второй — во втором;
- вертикальные оси обоих столбцов совпадают во всех строках списка;
- видимого разделителя между внутренними столбцами нет, поэтому два знака продолжают читаться как единая команда;
- каждый знак сохраняет естественную SVG-ширину внутри своего столбца;
- ширина каждого столбца = ширина canonical `X` при target height `40 dp` + `8%` reserve;
- межстолбцовый gap остаётся `4 dp`, боковые insets — по `4 dp`;
- guide threshold `36 dp`, SVG-aware stroke scaling и recognizer v2.1 не менялись.

Статус: **focused real-device PASS** — пользователь подтвердил, что исправленная двухстолбцовая композиция работает.

## KnockUI refinement block approved — 2026-10-03

После focused PASS двухстолбцового `Commands → НАЗНАЧЕНИЯ` утверждён следующий технический этап KnockUI.

Очередь:

1. end-arrow всех отображаемых 4Tap Graffiti — `1.20×` через shared renderer, без изменений recognizer;
2. инфраструктура временной expanded surface над остающимся снизу KnockUI;
3. read-only `6×6` поверхность всех 36 образцов Graffiti; новая пиктограмма ожидается от владельца проекта;
4. `Клавиатура` / Android App Search: standard IME, live-search launchable apps по display name, запуск через существующий app path; новая пиктограмма ожидается;
5. `Ярлыки`: пользовательская закрепляемая grid, возможные горизонтальные страницы; frequent suggestions только из собственной истории 4Tap, без `PACKAGE_USAGE_STATS` в v1;
6. Draw visual feedback: `empty → active → recognized → pair ready → executing`, с ослаблением пустых Frames и усилением feedback результата/действия.

Expanded surfaces не становятся новыми remembered panels. Каждый подпункт проходит отдельный canon/build/device-review gate.

## Graffiti end-arrow +20% implementation — 2026-10-03

Первый подпункт утверждённого KnockUI refinement block реализован в Android candidate.

- shared `GraffitiRenderer` увеличивает end-arrow до `1.20×`;
- local scale применяется только к конечному треугольнику;
- pivot выбирается как геометрический конец trajectory, ближайший к end-arrow, поэтому raw SVG path direction не влияет на привязку;
- trajectory, stroke-width, start circle, canonical SVG и recognizer v2.1 не изменены;
- общее guide visibility rule `>=36 dp` сохранено;
- изменение распространяется на все поверхности, использующие shared renderer.

Статус: **implementation candidate; build/install/device review pending**. Следующий подпункт после проверки — `expanded surface above KnockUI`.

